var url = require('url');
const { MongoClient, ObjectID } = require('mongodb');
var customerdb = require('../model/customer');
var companydb = require('../model/company');
var servicesdb = require('../model/services');
var taxdb = require('../model/tax');
require('dotenv').config();
var invoicedb = require('../model/invoice');
const BASE_URL = process.env.BASE_URL
var dateFormat = require('dateformat');

const csv = require("fast-csv");
const fs = require("fs");

exports.excelData = async (req, res)=>{
    try {
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
                    service_code: {"$in": sacCode}
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

        const csvStream = csv.format({ headers: true, width:20 });
        if (!fs.existsSync("public/files/export/")) {
            if (!fs.existsSync("public/files")) {
                fs.mkdirSync("public/files/");
            }
            if (!fs.existsSync("public/files/export")) {
                fs.mkdirSync("./public/files/export/");
            }
        }

        const writablestream = fs.createWriteStream(
            "public/files/export/invoice.csv"
        );

        csvStream.pipe(writablestream);
        csv.columns = [  
            { width: 10 }, { width: 10 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 70 },
            { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 },
            { width: 20 }
          ];  

        writablestream.on("finish", function () {
            res.json({
                downloadUrl: `${BASE_URL}/files/export/invoice.csv`,
            });
        });
        await invoicedb.find(query)
                .sort(mysort)
                .populate({ path: 'customer', select: ['name','address','gstno'] })
                .populate({ path: 'taxe', select: 'tax' })
                .populate({ path: 'service', select: ['sr_name','price','qty' ,'sac_code'] })
                .then(function(result){
        if (result.length > 0) {
            result.map((user) => {
                var totaltax = 0;
                var subtotal = 0;
                var total = 0;
                var ServiceName = '';
                var ServiceCode = '';
                const amounts = user.profileName_rate.map((transaction) => transaction.rate);
                subtotal= amounts.reduce((acc, item) => (Number(acc) + Number(item)), 0)
                totaltax = subtotal*18/100;
                total = totaltax+subtotal;
                //user.profileName_rate.forEach(function(element){
                   // subtotal= element.rate?.reduce((acc, item) => (Number(acc) + Number(item)), 0)
                   // totaltax += element.rate * 18 / 100;
                    //subtotal += element.rate;
                   // total += (element.rate * 18 / 100)+element.rate;
                    // ServiceName = ServiceName.concat(element.sr_name,',')
                    // ServiceCode = ServiceCode.concat(element.sac_code,',')
                    ServiceName = user.service_name
                    ServiceCode = user.service_code
               // });
                //console.log(user.service_name)
                csvStream.write({
                    'INV Date': user.createdAt ? dateFormat(user.createdAt,'dd-mm-yyyy') : "-",
                    'Invoice': user.invoice ? user.invoice : "-",
                    'Customer Name': user.customer.name ? user.customer.name : "-",
                    'GST No': user.customer.gstno ? user.customer.gstno : "-",
                    'Tax %': (user.tax == 1 ) ? '18% (IGST)': '18% (SGST 9% + CGST 9%)',
                    'Service': ServiceName ? ServiceName : "-",
                    'SAC Code': ServiceCode ? ServiceCode : "-",
                    'IGST': (user.status) ? (user.tax == 1) ? subtotal * 18 / 100 : '' : 0,
                    'SGST': (user.status) ? (user.tax == 2) ? subtotal * 9 / 100 : '' : 0,
                    'CGST': (user.status) ? (user.tax == 2) ? subtotal * 9 / 100 : '' : 0,
                    'SubTotal Amount': (user.status) ? subtotal : 0,
                    'Total Tax Amount': (user.status) ? totaltax : 0,
                    'Total Invoice Amount': (user.status) ? total : 0,
                })
            })
        }
    });
        csvStream.end();
        writablestream.end();
    } catch (error) {
        res.status(401).json(error)
    }
}