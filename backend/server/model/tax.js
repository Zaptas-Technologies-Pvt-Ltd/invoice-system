const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    tax : {
        type : Number,
        required: true
    },
    tax_type : {
        type : Number,
        required: true
    }
})

const taxdb = mongoose.model('taxe', schema);

module.exports = taxdb;