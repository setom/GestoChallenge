var mongoose = require('mongoose');

//the model of a Food item in the MongoDB
module.exports = mongoose.model('Food', {
    //a string field for the FOOD NAME
    name: {
        type: String,
        default: ''
    },
    //a number for a food price
    price: {
        type: Number,
        default: 0
    }, 
    //a number that holds the tax value
    //currently magic number of 7.5%
    tax: {
        type: Number, 
        default: 1.075 
    }
});