const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new mongoose.Schema({  
    customerid: {
        type: Schema.Types.ObjectId,
        ref: 'customer',
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
    polistdata : {
        type: Array,
        required: true
    },
    taxtype : {
        type : Number,
        required: true
    },
    pono: {
        type: String,
    },

    podate: {
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

const POCreatedb = mongoose.model('POCreate', schema);

module.exports = POCreatedb;   