const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    userName : {
        type : String,
        required: true
    },
    password : {
        type : String,
        required: true
    },
    companyName : {
        type: String,
        required: true
    },

    companyAddress : {
        type: String,
        required: true
    },
    companyGST : {
        type: String,
        required: true
    },
    bankName : {
        type: String,
        required: true
    },
    accountNumber : {
        type: Number,
        required: true
    },
    ifscCode : {
        type: String,
        required: true
    },
    status: {
        type:Boolean,
        default:true
    },
  
})

const authdb = mongoose.model('admin', schema);

module.exports = authdb;