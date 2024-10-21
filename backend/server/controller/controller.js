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


const connectDB = require('../database/connection');
/* autoIncrement.initialize(connectDB); */


exports.invoicefindByid = (req, res)=> {
    const id = req.params.id;
    invoicedb.findById(id).populate({ path: 'customer', select: ['name','address','gstno'] }).populate({ path: 'tax', select: 'tax' }).populate({ path: 'service', select: ['sr_name','price','qty','sac_code'] })
    .then(invoice => {
        res.send(invoice)
    })
    .catch(err => {
        res.status(500).send({ message : err.message || "Error Occurred while retriving invoice information" })
    })
}


exports.invoicefind = (req, res)=> {
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
               // service_code: {"$in": sacCode}
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
    invoicedb.find(query)
    .sort(mysort)
    .populate({ path: 'customer', select: ['name','address','gstno'] })
    .populate({ path: 'tax', select: 'tax' })
    .populate({ path: 'service', select: ['sr_name','price','qty' ,'sac_code'] })
    .then(invoice => {
        res.status(200).send(
            {
                success: (invoice !='')?true:false,
                message: "Data fatched successfully",
                data: invoice,
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
async function getNextSequenceValue(callback) {
    try {
        const Cusdate = ['01-04-2023', '01-04-2024', '01-04-2025', '01-04-2026', '01-04-2027', '01-04-2028', '01-04-2029'];
        
        let date_time = new Date();
        let date = ("0" + date_time.getDate()).slice(-2);
        let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
        let year = date_time.getFullYear();
        let currentDate = date + "-" + month + "-" + year;

        // Check if the current date matches any of the dates in Cusdate
        if (Cusdate.includes(currentDate)) {
            // Reset sequence_value to 1 if a match is found
            await counterdb.findOneAndUpdate({ _id: 'invoiceid' }, { $set: { sequence_value: 1 } });
            console.log('Reset sequence_value to 1');
        }

        // Increment sequence_value
        await counterdb.findOneAndUpdate({ _id: 'invoiceid' }, { $inc: { sequence_value: 1 } });

        // Retrieve the updated sequence_value
        const result = await counterdb.findOne({ _id: 'invoiceid' });

        // Execute the callback with the updated sequence_value
        if (result) {
            callback(result.sequence_value);
        }
    } catch (error) {
        console.error("Error in getNextSequenceValue:", error);
    }
}


// create and save new user
exports.create = (req,res)=>{
    console.log(req.body,'dddddd')
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    getNextSequenceValue((data) =>{
        var dt = dateTime.create();

        // new invoice
       // console.log(req.body.serviceCode)
        const invoice = new invoicedb({
            customer : req.body.customer,
            service : req.body.service,
            service_name : req.body.serviceName,
            service_code : req.body.serviceCode.toString(),
            //service_code : req.body.serviceCode,
            profileName_rate: req.body.profilesDetails,
            tax: req.body.tax,
            po:req.body.po,
            podate:(req.body.podate != '') ? dateTime.create(req.body.podate).format('d-m-Y') : '', 
            createdAt: (req.body.createdAt)?dateTime.create(req.body.createdAt).format('Y-m-d'):dt.format('Y-m-d'), 
            invoice:'00'+data,
            payment : req.body.payment
        })
    
        invoice
            .save(invoice)
            .then(data => {
                res.status(200).send({
                    success: true,
                    message : 'invoice create successfully'
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

// create and save new customer
exports.customercreate = (req , res)=>{
    
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    // new customer
    const customer = new customerdb({
        name : req.body.cname,
        gstno : req.body.cgst,
        address : req.body.caddress
    })

    // save customer in the database
    customer
        .save(customer)
        .then(data => {
            res.status(200).send({
                success: true,
                message : 'customer create successfully'
            });
        })
        .catch(err =>{
            res.status(500).send({
                success: false,
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}


//update  customer
exports.customerupdate = (req , res)=>{
    
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    const id = req.params.id;
        customerdb.update({ _id: ObjectID(id)}, { 
            name : req.body.cname,
            gstno : req.body.cgst,
            address : req.body.caddress
        }).then(data => {
            res.status(200).send({
                success: true,
                message : 'customer update successfully'
            });
        })
        .catch(err =>{
            res.status(500).send({
                success: false,
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}

// update and save new services
exports.serviceupdate = (req , res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    const id = req.params.id;
    servicesdb.update({ _id: ObjectID(id)}, { 
        price : req.body.sprice,
        qty : req.body.sqty,
        sr_name : req.body.sname,
        sac_code : req.body.scode
    }).then(data => {
            res.status(200).send({
                success: true,
                message : 'services update successfully'
            });
        })
        .catch(err =>{
            res.status(500).send({
                success: false,
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}

// update 
exports.invoiceUpdate = (req , res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    const id = req.params.id;
    invoicedb.update({ _id: ObjectID(id)}, { 
        status : false,
    }).then(data => {
            res.status(200).send({
                success: true,
                message : 'invoice update successfully'
            });
        })
        .catch(err =>{
            res.status(500).send({
                success: false,
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}


//edit service

exports.editservice = (req , res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    const id = req.params.id;

    console.log(req.body.service_name);
    
    invoicedb.update({ _id: ObjectID(id)}, { 
        service_name : req.body.service_name,
    }).then(data => {
            res.status(200).send({
                success: true,
                message : 'services update successfully'
            });
        })
        .catch(err =>{
            res.status(500).send({
                success: false,
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}


// create and save new services
exports.servicecreate = (req , res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    // new services
    const services = new servicesdb({
        price : req.body.sprice,
        qty : req.body.sqty,
        sr_name : req.body.sname,
        sac_code : req.body.scode
    })

    // save services in the database
    services
        .save(services)
        .then(data => {
            res.status(200).send({
                success: true,
                message : 'services create successfully'
            });
        })
        .catch(err =>{
            res.status(500).send({
                success: false,
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}


// retrieve and return all users/ retrive and return a single user
exports.customerfindByid = (req, res)=> {
    const id = req.params.id;
    customerdb.findById(id)
    .then(customer => {
        res.send(customer)
    })
    .catch(err => {
        res.status(500).send({ message : err.message || "Error Occurred while retriving customer information" })
    })
}


// retrieve and return all users/ retrive and return a single user
exports.customerfind =async (req, res)=> {

    try{
        const list = await customerdb.find()
        return res.status(200).send({
            success: true,
            message: "Data fatched successfully",
            data: list,
        });

    }catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
}
    // .then(customer => {
    //     res.send(customer)
    // })
    // .catch(err => {
    //     res.status(500).send({ message : err.message || "Error Occurred while retriving customer information" })
    // })
}

exports.companyfind = (req, res)=> {

    companydb.find()
    .then(company => {
        res.send(company)
    })
    .catch(err => {
        res.status(500).send({ message : err.message || "Error Occurred while retriving company information" })
    })
}

exports.servicesfind =async (req, res)=> {

    servicesdb.find()
    .then(services => {
        res.status(200).send(
            {
                success: (services !='')?true:false,
                message: "Data fatched successfully",
                data: services,
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

exports.servicesfindByid = (req, res)=> {
    const id = req.params.id;
    servicesdb.findById(id)
    .then(services => {
        res.send(services)
    })
    .catch(err => {
        res.status(500).send({ message : err.message || "Error Occurred while retriving services information" })
    })
}


exports.taxfind =async (req, res)=> {

    taxdb.find()
    .then(tax => {
        res.status(200).send(
            {
                success: (tax !='')?true:false,
                message: "Data fatched successfully",
                data: tax,
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

exports.createExcel = (req, res)=> {

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var mysort = { _id: -1 }; 
    invoicedb.find(
        {"createdAt":{ $gte: new Date(query.fromdate), $lt: new Date(query.todate) }})
        .sort(mysort)
        .populate({ path: 'customer', select: ['name','address','gstno'] })
        .populate({ path: 'tax', select: 'tax' })
        .populate({ path: 'service', select: ['sr_name','price','qty' ,'sac_code'] })
        .then(function(result){
        var collection = [];
        result.forEach(function(data){
            var totaltax = 0;
            var subtotal = 0;
            var total = 0;
            data.service.forEach(function(element){
                totaltax += element.price * 18 / 100;
                subtotal += element.price;
                total += (element.price * 18 / 100)+element.price;
            });

            collection.push({
                createdAt:data.createdAt,
                invoice:data.invoice,
                customer:data.customer.name,
                gst:data.customer.gstno,
                tax_type:(data.tax == 1 ) ? '18% (IGST)': '18% (SGST 9% + CGST 9%)',
                service:data.service_name.toString(),
                igst: (data.status) ? (data.tax == 1) ? subtotal * 18 / 100 : '' : 0,
                sgst: (data.status) ? (data.tax == 2) ? subtotal * 9 / 100 : '' : 0,
                cgst: (data.status) ? (data.tax == 2) ? subtotal * 9 / 100 : '' : 0,

                alligst:(data.status) ? (data.tax == 1) ? subtotal * 18 / 100 : 0 : 0,
                allsgst:(data.status) ? (data.tax == 2) ? subtotal * 9 / 100 : 0 : 0,
                allcgst:(data.status) ? (data.tax == 2) ? subtotal * 9 / 100 : 0 : 0,

                amount:(data.status) ? subtotal : 0,
                tax:(data.status) ? totaltax : 0,
                total:(data.status) ? total : 0
            });
        });

        var alltotaltax = 0;
        var allsubtotal = 0;
        var alltotal = 0;
        var alligst = 0;
        var allsgst = 0;
        var allcgst = 0;

        collection.forEach(function(element){
            alltotaltax += element.tax
            allsubtotal += element.amount
            alltotal += element.total
            alligst += element.alligst
            allsgst += element.allsgst
            allcgst += element.allcgst
        });


        collection.push({
            createdAt:'',
            invoice:'',
            customer:'',
            gst:'',
            service:'Total',
            igst:alligst,
            sgst:allsgst,
            cgst:allcgst,
            amount:allsubtotal,
            tax:alltotaltax,
            total:alltotal
        });

        createExcel(collection).then(function(result) {
            res.download('invoice.xlsx');
        });
    });
}

async function createExcel(data){
    var dt = dateTime.create();
    var file_path = 'invoice.xlsx';
    try{
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('invoice');
        worksheet.columns = [
            {header: 'INV Date', key: 'createdAt', width: 10},
            {header: 'Invoice', key: 'invoice', width: 10},
            {header: 'Customer', key: 'customer', width: 30},
            {header: 'GST No', key: 'gst', width: 30},
            {header: 'Tax', key: 'tax_type', width: 30},
            {header: 'Service', key: 'service', width: 70},
            {header: 'Amount', key: 'amount', width: 10},
            {header: 'IGST', key: 'igst', width: 10},
            {header: 'SGST', key: 'sgst', width: 10},
            {header: 'CGST', key: 'cgst', width: 10},
            //{header: 'Tax', key: 'tax', width: 10},
            {header: 'Total', key: 'total', width: 10},
        ];

        data.forEach(invoice => {
            worksheet.addRow(invoice);
        });
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = {bold: true};
        });

        await workbook.xlsx.writeFile(file_path);
        return({message : `File created at ${file_path}`, status : "success", status_code : 200});
    }
    catch(err){
        throw new Error(err);
    }
}
// Total Listing.......
exports.totalData =async (req , res)=>{
    const customerCount = await customerdb.find();
    const serviceCount = await servicesdb.find();
    const invoiceCount = await invoicedb.find();
    const poCount = await POCreatedb.find();

    var sum = 0;

    for(var i=0; i < invoiceCount.length; i++){
       ArryAmount =invoiceCount[i].profileName_rate;
       console.log(ArryAmount);
       for(item in ArryAmount) {
       //console.log(item);
            sum += parseInt(item.rate);   
       }
    }
    
    return res.status(200).json({
        success: true,
        // amount: invoiceCount,
        customerCount: customerCount.length,
        serviceCount: serviceCount.length,
        invoiceCount: invoiceCount.length,
        poCount: poCount.length,
      });
}





