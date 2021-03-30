//importing express module
const express = require('express')
//creating an object called app and calling top level express() function
const app = express();

//Importing bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Importing helmet 
const helmet = require("helmet");
app.use(helmet());

//fileHandler module
const fileHandler = require('fs');

//node fetch
const fetch = require('node-fetch');

//enviroment variable
const PORT = process.env.PORT || 3001


//app.get routing method
app.get('/', (req, res) => {
    res.send(`Welcome!`)
})

//app.get routing method with api/search path
app.get('/api/search/:term/:media', async (req, res) => {
    //getting the term and media with req.params
    const { term, media } = req.params;

    //fetch itunes api
    const response = await fetch(`https://itunes.apple.com/search?term=${term}&media=${media}&limit=20`);
    const data = await response.json();
    
    res.send(data);
    
})

//app.get routing method with api/favourites path that returns the favourites json
app.get('/api/favourites', (req, res) => {
    fileHandler.readFile('favourites.json', (err, data) => {
        if (err) res.send('File not found.');
        else
            res.send(`${data}`);
    })
})

//app.post method 
app.post('/api/favourites', (req, res) => {

    //getting user input with req.body 
    const newItem = {
        id: Number(req.body.id),
        title: req.body.title,
        artist: req.body.artist,
        type: req.body.type
    }
    
    //retrieving the web projects json
    fileHandler.readFile('favourites.json', (err, data) => {

        //using push to add newItem to the array of web project items
        let json = JSON.parse(data);
        json.push(newItem); 

        //writeFile the new web project items  
        fileHandler.writeFile("favourites.json", JSON.stringify(json), (err) => {
            if (err) res.send('Cant add items!');
            else
                res.send(`Added!`);
        })
    })
})

//app.delete method
app.delete('/api/favourites', (req, res) => {
    //retrieving the web projects json
    fileHandler.readFile('favourites.json', (err, data) => {

        //getting the json
        let json = JSON.parse(data);
        //finding the index of correlating id 
        let num = json.findIndex(obj => obj.id == Number(req.body.id))

        //using filter to get everything but the selected item 
        let filtered = json.filter((theItem) => {
            return theItem != json[num]
        });

        //writeFile the new web project items with the filtered items 
        fileHandler.writeFile("favourites.json", JSON.stringify(filtered), (err) => {
            if (err) res.send('Cant delete item!');
            else
                res.send(`Item Deleted!`);
        })
    })
})


//listen method 
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)
})