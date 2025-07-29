var customerdb = require('../model/customer');
var companydb = require('../model/company');
var servicesdb = require('../model/services');
var taxdb = require('../model/tax');
var counterdb = require('../model/counter');
var POCreatedb = require('../model/POModel');
var dateTime = require('node-datetime');
var dateFormat = require('dateformat');
var url = require('url');
const { MongoClient, ObjectID } = require('mongodb');
const ReminderForPO = require('../model/ReminderForPO');

async function getNextSequenceValue(callback){
    try{
        //counterdb.update({'_id':'invoiceid'},{'$inc':{'sequence_value':1}}).then(
            counterdb.find({'_id':'invoiceid'}).then((data)=>{
                callback(Object.assign({},data)[0].sequence_value);
            })
        //)
    }catch(error){
        
    }
 }
// create and save new user
exports.createPO = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    getNextSequenceValue(async (data) => {
        try {
            var dt = dateTime.create();

            const podetails = new POCreatedb({
                customerid: req.body.customer,
                serviceid: req.body.service,
                servicename: req.body.serviceName,
                servicecode: req.body.serviceCode,
                polistdata: req.body.polistData,
                taxtype: req.body.tax,
                pono: req.body.ponuber,
                podate: (req.body.podate !== '') ? req.body.podate : '',
                createdAt: dt.format('Y-m-d'),
            });

            const savedPO = await podetails.save();

            // ✅ Filter polistData: only where reminderRequired is "Yes" and reminderDate exists & is non-empty
            const remindersToInsert = req.body.polistData
                .filter(item => 
                    item.reminderRequired === "Yes" && 
                    item.reminderDate && item.reminderDate.trim() !== ""
                )
                .map(item => ({
                    poId: savedPO._id,
                    pono: req.body.ponuber,
                    profileName: item.profileName,
                    rate: item.rate,
                    remark: item.remark,
                    reminderRequired: item.reminderRequired,
                    reminderDate: item.reminderDate,
                    invoiceCreated: item.invoiceCreated || false,
                    statusActive: true,              // active by default
                    reminderSuccessful: false,       // not yet sent
                    reminderSent1: false,
                    reminderSent3: false,
                    reminderSent5: false
                }));

            if (remindersToInsert.length > 0) {
                await ReminderForPO.insertMany(remindersToInsert);
            }

            return res.status(200).send({
                success: true,
                message: 'PO created successfully'
            });

        } catch (err) {
            console.error("Create PO error:", err);
            return res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating PO"
            });
        }
    });
};

exports.PoTotalLists = async (req, res) => {
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
                service_code: sacCode
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
    POCreatedb.find(query,'pono servicename servicecode status podate polistdata')
    .sort(mysort)
    .populate({ path: 'customerid', select: ['name'] })
    .then(podata => {
        res.status(200).send(
            {
                success: (podata !='')?true:false,
                message: "Data fatched successfully",
                data: podata,
            })
    })
    .catch(err => {
        res.status(500).send( 
            {
                message: err.message,
                success: false,
                data: null,
            })
            //message : err.message || "Error Occurred while retriving invoice information" })
        })
}
exports.PoLists = async (req, res) => {
    try {
        const id = req.params.id;
        const list = await POCreatedb.find(
            { customerid: id, status: true },
            '_id pono'
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

exports.PoListDetail = async (req, res) => {
    try{
        const id = req.params.id;
        const list = await POCreatedb.find({_id:id});
        return res.status(200).send({
            success: true,
            message: "Data fatched successfully",
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