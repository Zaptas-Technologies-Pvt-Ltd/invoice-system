const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new mongoose.Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },

    service: [{
        type: Schema.Types.ObjectId,
        ref: 'service',
        required: true
    }],

    service_name: [{
        type: Array,
        required: true
    }],
    service_code: {
        type: String,
        required: true
    },
    profileName_rate: {
        type: Array,
        required: true
    },
    tax : {
        type : Number,
        required: true
    },

    po: {
        type: String,
    },

    podate: {
        type: String
    },
    status: {
        type:Boolean,
        default:true
    },
    invoice: {
        type: String,
    },
    payment: {
        type: String,
        maxlength: 255,
        required: true,
    },
},
    { timestamps: true }
)

const invoicedb = mongoose.model('invoice', schema);


module.exports = invoicedb;