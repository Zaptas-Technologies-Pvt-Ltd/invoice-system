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
        type: String,
        required: true
    },

    web : {
        type: String,
        required: true
    },

    logo : {
        type: String,
        required: true
    }
  
})

const companydb = mongoose.model('company', schema);

module.exports = companydb;