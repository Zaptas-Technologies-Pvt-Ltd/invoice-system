const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new mongoose.Schema({

    _id: {
        type: String,
    },
    sequence_value: {
        type: Number,
    },
})

const counterdb = mongoose.model('counter', schema);


module.exports = counterdb;