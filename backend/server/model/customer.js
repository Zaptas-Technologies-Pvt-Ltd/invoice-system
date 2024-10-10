const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    address : {
        type: String,
        required: true
    },

    gstno : {
        type: String
    }
  
})

const customerdb = mongoose.model('customer', schema);

module.exports = customerdb;