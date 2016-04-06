var mongoose = require('mongoose');

//the model of a Food item in the MongoDB
module.exports = mongoose.model('History', {
    //a date for the date
    date: {
        type: Date,
        default: ''
    },
    //the total of the order
    orderTotal: {
        type: Number, 
        default: 0
    }
});