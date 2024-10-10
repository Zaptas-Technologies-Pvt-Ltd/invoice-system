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

async function getNextSequenceValue(callback){
    try{
        //counterdb.update({'_id':'invoiceid'},{'$inc':{'sequence_value':1}}).then(
            counterdb.find({'_id':'invoiceid'}).then((data)=>{
                callback(Object.assign({},data)[0].sequence_value);
            })
       // )
    }catch(error){
        
    }
 }
// create and save new user
exports.createPO = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    getNextSequenceValue((data) =>{
        var dt = dateTime.create();

        // new invoice
        const podetails = new POCreatedb({
            customerid : req.body.customer,
            serviceid : req.body.service,
            servicename : req.body.serviceName,
            servicecode : req.body.serviceCode,
            polistdata: req.body.polistData,
            taxtype: req.body.tax,
            pono:req.body.ponuber,
            //podate:(req.body.podate != '') ? dateTime.create(req.body.podate).format('d-m-Y') : '', 
            podate:(req.body.podate != '') ? req.body.podate: '', 
            createdAt:dt.format('Y-m-d'), 
        })
    
        podetails
            .save(podetails)
            .then(data => {
                res.status(200).send({
                    success: true,
                    message : 'PO create successfully'
                });
            })
            .catch(err =>{
                res.status(500).send({
                    success: false,
                    message : err.message || "Some error occurred while creating a create operation"
                });
            });
    });
}
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
    try{
        const id = req.params.id;
        const list = await POCreatedb.find({customerid:id},'_id pono');
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