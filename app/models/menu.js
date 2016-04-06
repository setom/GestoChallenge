var mongoose = require('mongoose');

module.exports = mongoose.model('Menu', {
    //a string field for the menu item name
    name: {
        type: String,
        default: ''
    },
    //a number for a menu item price
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