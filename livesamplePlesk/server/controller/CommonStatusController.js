var customerdb = require('../model/customer');
var companydb = require('../model/company');
var servicesdb = require('../model/services');
var taxdb = require('../model/tax');
var invoicedb = require('../model/invoice');
var counterdb = require('../model/counter');
var POCreatedb = require('../model/POModel');
var dateTime = require('node-datetime');
var dateFormat = require('dateformat');
const excel = require('exceljs');
var url = require('url');
const { MongoClient, ObjectID } = require('mongodb');

exports.updateStatus = (req , res)=>{
    // validate request
    try{
        
        if(!req.body){
            res.status(400).send({ message : "Content can not be emtpy!"});
            return;
        }
        
    const ids = req.params.id;
    const data = ids.split("-");
    const id=data[0];
    const status=data[1];
    const type=data[2];
        if(type == 'po'){
          var dbAllow = POCreatedb;
        }else{
             res.status(500).send({
                message: "Type not get Failed!",
                success: false,
            });
            return;
        }
        var statusUpdate =(status ==1)?'true':'false';
        dbAllow.update({ _id: ObjectID(id)}, { 
            status : statusUpdate,
        }).then(data => {
                res.status(200).send({
                    success: true,
                    message : 'update successfully'
                });
            })
            .catch(err =>{
                res.status(500).send({
                    success: false,
                    message : err.message || "Some error occurred while creating a create operation"
                });
            });
    }catch (error) {
            return res.status(500).send({
                message: "outside Status Failed!",
                success: false,
            });
    }

}
exports.updateDelete = (req , res)=>{
    // validate request
    try{
        
        if(!req.body){
            res.status(400).send({ message : "Content can not be emtpy!"});
            return;
        }
        
    const ids = req.params.id;
    const data = ids.split("-");
    const id=data[0];
    const status=data[1];
    const type=data[2];
        if(type == 'po'){
          var dbAllow = POCreatedb;
        }else{
             res.status(500).send({
                message: "Type not get Failed!",
                success: false,
            });
            return;
        }
        var statusUpdate =(status ==1)?'false':'true';
        dbAllow.update({ _id: ObjectID(id)}, { 
            delete : statusUpdate,
        }).then(data => {
                res.status(200).send({
                    success: true,
                    message : 'update successfully'
                });
            })
            .catch(err =>{
                res.status(500).send({
                    success: false,
                    message : err.message || "Some error occurred while creating a create operation"
                });
            });
    }catch (error) {
            return res.status(500).send({
                message: "outside Status Failed!",
                success: false,
            });
    }

}