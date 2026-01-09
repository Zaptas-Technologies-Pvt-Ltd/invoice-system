var customerdb = require('../model/customer');
var companydb = require('../model/company');
var servicesdb = require('../model/services');
var taxdb = require('../model/tax');
var counterdb = require('../model/counter');
var NoteCreatedb = require('../model/NoteModel');
var invoicedb = require('../model/invoice');
var dateTime = require('node-datetime');
var dateFormat = require('dateformat');
var url = require('url');
const { MongoClient, ObjectID } = require('mongodb');

async function getNextSequenceValue(callback){
    try{
        counterdb.find({'_id':'invoiceid'}).then((data)=>{
            callback(Object.assign({},data)[0].sequence_value);
        })
    }catch(error){
        
    }
 }

// create and save new note
exports.createNote = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    getNextSequenceValue(async (data) => {
        try {
            var dt = dateTime.create();

            const notedetails = new NoteCreatedb({
                customerid: req.body.customer,
                invoiceid: req.body.invoiceId,
                serviceid: req.body.service,
                servicename: req.body.serviceName,
                servicecode: req.body.serviceCode,
                notelistdata: req.body.notelistData,
                taxtype: req.body.tax,
                invoiceno: req.body.invoiceNo,
                invoicedate: (req.body.invoiceDate !== '') ? req.body.invoiceDate : '',
                createdAt: dt.format('Y-m-d'),
            });

            const savedNote = await notedetails.save();

            return res.status(200).send({
                success: true,
                message: 'Note created successfully'
            });

        } catch (err) {
            console.error("Create Note error:", err);
            return res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating Note"
            });
        }
    });
};

exports.NoteTotalLists = async (req, res) => {
    var mysort = { _id: -1 }; 
    const fdate = req.query.fromdate || "" 
    const ldate = req.query.todate || "" 
    const sacCode = req.query.saccode || "" 
    
    if(fdate !='' && ldate !=''){
        if(sacCode !=''){
            var query = {
                createdAt: {
                    $gte: fdate?fdate:'', 
                    $lte: ldate?ldate:''
                },
                servicecode: sacCode
            }
        }else{
        var query = {
                createdAt: {
                    $gte: fdate?fdate:'', 
                    $lte: ldate?ldate:''
                },
            }
        }
        }else{
            var query = {}
    }
    NoteCreatedb.find(query,'invoiceno servicename servicecode status invoicedate notelistdata')
    .sort(mysort)
    .populate({ path: 'customerid', select: ['name'] })
    .populate({ path: 'invoiceid', select: ['invoice'] })
    .then(notedata => {
        res.status(200).send(
            {
                success: (notedata !='')?true:false,
                message: "Data fetched successfully",
                data: notedata,
            })
    })
    .catch(err => {
        res.status(500).send( 
            {
                message: err.message,
                success: false,
                data: null,
            })
        })
}

exports.NoteLists = async (req, res) => {
    try {
        const id = req.params.id;
        const list = await NoteCreatedb.find(
            { customerid: id, status: true },
            '_id invoiceno'
        );
        return res.status(200).send({
            success: true,
            message: "Data fetched successfully",
            data: list,
        });

    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
};

exports.NoteListDetail = async (req, res) => {
    try{
        const id = req.params.id;
        const list = await NoteCreatedb.find({_id:id});
        return res.status(200).send({
            success: true,
            message: "Data fetched successfully",
            data: list,
        })
    }catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        })
    }
}
