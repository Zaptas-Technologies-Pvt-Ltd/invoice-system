const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new mongoose.Schema({  
    customerid: {
        type: Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    invoiceid: {
        type: Schema.Types.ObjectId,
        ref: 'invoice',
        required: true
    },
    serviceid: [{
        type: Schema.Types.ObjectId,
        ref: 'service',
        required: true
    }],

    servicename: [{
        type: Array,
        required: true
    }],
    servicecode: {
        type: Array,
        required: true
    },
    notelistdata : {
        type: Array,
        required: true
    },
    taxtype : {
        type : Number,
        required: true
    },
    invoiceno: {
        type: String,
    },
    invoicedate: {
        type: String
    },
    status: {
        type:Boolean,
        default:true
    },
    delete: {
        type:Boolean,
        default:true
    },
    
},{ timestamps: true })

const NoteCreatedb = mongoose.model('NoteCreate', schema);

module.exports = NoteCreatedb;
