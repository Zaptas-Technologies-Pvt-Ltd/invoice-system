const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    price : {
        type : Number,
        required: true
    },
    qty : {
        type: Number,
        required: true
    },

    sr_name : {
        type: String,
        required: true
    },
    
    sac_code : {
        type: String,
        required: true
    }
  
})

const servicesdb = mongoose.model('service', schema);

module.exports = servicesdb;