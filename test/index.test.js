//importing tax module
const index = require('../index');

//expect assertion style
const expect = require('chai').expect;

const fetchData = (data) => {
    fetch(`https://itunes.apple.com/search?term=drake&media=music&limit=20`)
    .then(response => response.json())
    .then(json => data )
}

//describe function
describe('Fetch', function() {
    it('should be a string', function(){
        fetchData((data) => {
            let newData = data;
        });
        expect(newData).to.be.a('array');
    })
})