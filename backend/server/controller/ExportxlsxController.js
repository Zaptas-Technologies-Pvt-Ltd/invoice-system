var url = require('url');
const { MongoClient, ObjectID } = require('mongodb');
var customerdb = require('../model/customer');
var companydb = require('../model/company');
var servicesdb = require('../model/services');
var taxdb = require('../model/tax');
var invoicedb = require('../model/invoice');
require('dotenv').config();
const BASE_URL = process.env.BASE_URL
var dateFormat = require('dateformat');
const excel = require("exceljs");

exports.xlsxDataAll = async (req, res) => {
    try {
        var mysort = { _id: -1 };
        const fdate = req.query.fromdate || ""
        const ldate = req.query.todate || ""
        const sacCode = req.query.saccode || ""
        if (fdate != '' && ldate != '') {
            if (sacCode != '') {
                var query = {
                    createdAt: {
                        $gte: fdate ? fdate : '',
                        $lte: ldate ? ldate : ''
                    },
                    service_code: sacCode
                }
            } else {
                var query = {
                    createdAt: {
                        $gte: fdate ? fdate : '',
                        $lte: ldate ? ldate : ''
                    },
                }
            }
        } else {
            var query = {}
        }
        await invoicedb.find(query)
            .sort(mysort)
            .populate({ path: 'customer', select: ['name', 'address', 'gstno'] })
            .populate({ path: 'tax', select: 'tax' })
            .populate({ path: 'service', select: ['sr_name', 'price', 'qty', 'sac_code'] })
            .then(function (result) {
                if (result.length > 0) {

                    // result.findAll().then((objs) => {
                    let AddDataRow = [];
                    var index = 2;
                    result.forEach((obj) => {

                        // var totaltax = 0;
                        // var subtotal = 0;
                        // var total = 0;
                        // obj.profileName_rate.forEach(function(element){
                        // const totaltax = 0;
                        // const subtotal = 0;
                        // const total = 0;
                        // var ServiceName = '';
                        // var ServiceCode = '';
                        // const amounts = obj.profileName_rate.map((transaction) => transaction.rate);

                        // subtotal= amounts?.reduce((acc, item) => (Number(acc) + Number(item)), 0)
                        // totaltax = subtotal*18/100;
                        // total = totaltax+subtotal;
                        //});
                        AddDataRow.push({
                            createdAt: dateFormat(obj.createdAt, 'dd-mm-yyyy'),
                            invoice: obj.invoice,
                            customer: obj.customer.name,
                            gst: obj.customer.gstno,
                            tax_type: (obj.tax == 1) ? '18% (IGST)' : '18% (SGST 9% + CGST 9%)',
                            service: obj.service_name.toString(),
                            sacCode: obj.service_code.toString(),
                            igst: '',
                            sgst: '',
                            cgst: '',
                            alligst: '',
                            allsgst: '',
                            allcgst: '',
                            amount: '',
                            tax: '',
                            total: ''
                        });
                        // Profile Name's ////
                        obj.profileName_rate.map((profile) => {
                            //const amounts = obj.profileName_rate.map((transaction) => transaction.rate);
                            //console.log(subtotal)
                            var subtotal = parseInt(profile.rate)
                            var totaltax = parseInt(subtotal * 18 / 100);
                            var total = parseInt(totaltax + subtotal);
                            //
                            //console.log(total)
                            AddDataRow.push({
                                createdAt: '',
                                invoice: '',
                                customer: '',
                                gst: '',
                                tax_type: '',
                                service: '',
                                sacCode: '     ' + profile.profileName,
                                igst: (obj.status) ? (obj.tax == 1) ? profile.rate * 18 / 100 : '' : 0,
                                sgst: (obj.status) ? (obj.tax == 2) ? profile.rate * 9 / 100 : '' : 0,
                                cgst: (obj.status) ? (obj.tax == 2) ? profile.rate * 9 / 100 : '' : 0,

                                alligst: (obj.status) ? (obj.tax == 1) ? profile.rate * 18 / 100 : 0 : 0,
                                allsgst: (obj.status) ? (obj.tax == 2) ? profile.rate * 9 / 100 : 0 : 0,
                                allcgst: (obj.status) ? (obj.tax == 2) ? profile.rate * 9 / 100 : 0 : 0,

                                amount: (obj.status) ? subtotal : 0,
                                tax: (obj.status) ? totaltax : 0,
                                total: (obj.status) ? total : 0
                            });


                        });
                        //  var alltotaltax1 = 0; var allsubtotal1 = 0;var alltotal1 = 0;var alligst1 = 0; var allsgst1 = 0;var allcgst1 = 0;
                        //  AddDataRow.forEach(function(element){
                        //  if(element.tax !='' && element.amount !='' && element.total !=''){
                        //      alltotaltax1 = parseInt(alltotaltax1+element.tax)
                        //      allsubtotal1 += parseInt(element.amount)
                        //      alltotal1 += parseInt(element.total)
                        //      alligst1 += parseInt(element.alligst)
                        //      allsgst1 += parseInt(element.allsgst)
                        //      allcgst1 += parseInt(element.allcgst)
                        //      }
                        //  });
                        //  AddDataRow.push({
                        //      createdAt:'',
                        //      invoice:'',
                        //      customer:'',
                        //      gst:'',
                        //      service:'',
                        //      sacCode: 'Sub Total',
                        //      igst:alligst1,
                        //      sgst:allsgst1,
                        //      cgst:allcgst1,
                        //      amount:allsubtotal1,
                        //      tax:alltotaltax1,
                        //      total:alltotal1
                        //  });
                    });

                    var alltotaltax = 0; var allsubtotal = 0; var alltotal = 0; var alligst = 0; var allsgst = 0; var allcgst = 0;
                    AddDataRow.forEach(function (element) {
                        if (element.tax != '' && element.amount != '' && element.total != '') {
                            alltotaltax = parseInt(alltotaltax + element.tax)
                            allsubtotal += parseInt(element.amount)
                            alltotal += parseInt(element.total)
                            alligst += parseInt(element.alligst)
                            allsgst += parseInt(element.allsgst)
                            allcgst += parseInt(element.allcgst)
                        }
                    });

                    AddDataRow.push({
                        createdAt: '',
                        invoice: '',
                        customer: '',
                        gst: '',
                        service: '',
                        sacCode: 'Total',
                        igst: alligst,
                        sgst: allsgst,
                        cgst: allcgst,
                        amount: allsubtotal,
                        tax: alltotaltax,
                        total: alltotal
                    });
                    let workbook = new excel.Workbook();
                    let worksheet = workbook.addWorksheet("Sheet1");

                    worksheet.columns = [
                        { header: 'INV Date', key: 'createdAt', width: 12 },
                        { header: 'Invoice', key: 'invoice', width: 10 },
                        { header: 'Customer Name', key: 'customer', width: 30 },
                        { header: 'GST No', key: 'gst', width: 20 },
                        { header: 'Tax %', key: 'tax_type', width: 25 },
                        { header: 'Service', key: 'service', width: 35 },
                        { header: 'SAC Code', key: 'sacCode', width: 25 },
                        { header: 'IGST', key: 'igst', width: 10 },
                        { header: 'SGST', key: 'sgst', width: 10 },
                        { header: 'CGST', key: 'cgst', width: 10 },
                        { header: 'Invoice Amount', key: 'amount', width: 20 },
                        { header: 'Total Tax Amount', key: 'tax', width: 20 },
                        { header: 'Total Invoice Amount', key: 'total', width: 20 },
                    ];
                    //const row = worksheet.lastRow;
                    //console.log(worksheet.getRow())

                    worksheet.getRow(1).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        size: 25,
                        italic: true,
                        font: 'bold',
                        fgColor: { argb: 'FFFF00' }
                    }
                    // worksheet.getRow(1).eachCell((cell) => {
                    //     cell.font = {bold: true};
                    // });
                    // Add Array Rows
                    worksheet.addRows(AddDataRow);

                    res.setHeader(
                        "Content-Type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    );
                    res.setHeader(
                        "Content-Disposition",
                        "attachment; filename=" + fdate + '_TO_' + ldate + '_' + "invoice.xlsx"
                    );
                    // writablestream.on("finish", function () {
                    //     res.json({
                    //         downloadUrl: `${BASE_URL}/files/export/invoice.csv`,
                    //     });
                    // });
                    // workbook.xlsx.write(res).end();
                    // return 'Hello';
                    return workbook.xlsx.write(res).then(function () {
                        res.status(200).end();
                    });
                    //});
                }
            });
    } catch (error) {
        res.status(401).json(error)
    }

}

////   SAC Code filter Data..................
exports.xlsxDataSACCode = async (req, res) => {
    try {
        var mysort = { _id: -1 };
        const fdate = req.query.fromdate || ""
        const ldate = req.query.todate || ""
        const sacCode = req.query.saccode || ""
        if (fdate != '' && ldate != '') {
            if (sacCode != '') {
                var query = {
                    createdAt: {
                        $gte: fdate ? fdate : '',
                        $lte: ldate ? ldate : ''
                    },
                    service_code: sacCode,
                    status: true
                }
            } else {
                var query = {
                    createdAt: {
                        $gte: fdate ? fdate : '',
                        $lte: ldate ? ldate : ''
                    },
                    status: true
                }
            }
        } else {
            var query = {}
        }
        await invoicedb.find(query)
            .sort(mysort)
            //.populate({ path: 'customer', select: ['name','address','gstno'] })
            .populate({ path: 'tax', select: 'tax' })
            //.populate({ path: 'service', select: ['sr_name','price','qty' ,'sac_code'] })
            .then(function (result) {
                if (result.length > 0) {
                    let AddDataRow = [];
                    let arraySingleData = [];
                    result.forEach((obj, val) => {

                        var totaltax = 0;
                        var subtotal = 0;
                        var total = 0;

                        const amounts = obj.profileName_rate.map((transaction) => transaction.rate);
                        subtotal = amounts.reduce((acc, item) => (Number(acc) + Number(item)), 0)
                        totaltax = subtotal * 18 / 100;
                        total = totaltax + subtotal;
                        arraySingleData.push({
                            sacCode: obj.service_code.toString(),
                            amount: (obj.status) ? subtotal : 0,
                            igst: (obj.status) ? (obj.tax == 1) ? subtotal * 18 / 100 : 0 : 0,
                            sgst: (obj.status) ? (obj.tax == 2) ? subtotal * 9 / 100 : 0 : 0,
                            cgst: (obj.status) ? (obj.tax == 2) ? subtotal * 9 / 100 : 0 : 0,
                            alligst: (obj.status) ? (obj.tax == 1) ? subtotal * 18 / 100 : 0 : 0,
                            allsgst: (obj.status) ? (obj.tax == 2) ? subtotal * 9 / 100 : 0 : 0,
                            allcgst: (obj.status) ? (obj.tax == 2) ? subtotal * 9 / 100 : 0 : 0,
                            tax: (obj.status) ? totaltax : 0,
                            total: (obj.status) ? total : 0
                        })
                    });
                    var sacCode = Object.values(arraySingleData.reduce((acc, { sacCode, amount, igst, sgst, cgst, alligst, allsgst, allcgst, tax, total }) => {
                        acc[sacCode] = acc[sacCode] || { sacCode, amount: 0, igst: 0, sgst: 0, cgst: 0, alligst: 0, allsgst: 0, allcgst: 0, tax: 0, total: 0 };
                        acc[sacCode].amount += amount;
                        acc[sacCode].igst += igst;
                        acc[sacCode].sgst += sgst;
                        acc[sacCode].cgst += cgst;
                        acc[sacCode].alligst += alligst;
                        acc[sacCode].allsgst += allsgst;
                        acc[sacCode].allcgst += allcgst;
                        acc[sacCode].tax += tax;
                        acc[sacCode].total += total;

                        return acc;
                    }, {}));

                    sacCode.map((value) => {
                        AddDataRow.push({
                            sacCode: value.sacCode,
                            amount: (value.amount) ? value.amount : 0,
                            igst: (value.igst) ? value.igst : 0,
                            sgst: (value.sgst) ? value.sgst : 0,
                            cgst: (value.cgst) ? value.cgst : 0,
                            alligst: (value.alligst) ? value.alligst : 0,
                            allsgst: (value.allsgst) ? value.allsgst : 0,
                            allcgst: (value.allcgst) ? value.allcgst : 0,
                            tax: (value.tax) ? value.tax : 0,
                            total: (value.total) ? value.total : 0
                        });
                    });

                    var alltotaltax = 0; var allsubtotal = 0; var alltotal = 0; var alligst = 0; var allsgst = 0; var allcgst = 0;
                    AddDataRow.forEach(function (element) {
                        if (element.tax != '' && element.amount != '' && element.total != '') {
                            alltotaltax = parseInt(alltotaltax + element.tax)
                            allsubtotal += parseInt(element.amount)
                            alltotal += parseInt(element.total)
                            alligst += parseInt(element.alligst)
                            allsgst += parseInt(element.allsgst)
                            allcgst += parseInt(element.allcgst)
                        }
                    });
                    AddDataRow.push({
                        sacCode: '      ' + '      ' + '      ' + '      ' + '         ' + '    ' + 'Total',
                        amount: allsubtotal,
                        igst: alligst,
                        sgst: allsgst,
                        cgst: allcgst,
                        tax: alltotaltax,
                        total: alltotal
                    });
                    let workbook = new excel.Workbook();
                    let worksheet = workbook.addWorksheet("SAC Code Report");

                    worksheet.columns = [
                        { header: 'SAC Code', key: 'sacCode', width: 25, fgColor: 'FFFF00' },
                        { header: 'Invoice Amount', key: 'amount', width: 20 },
                        { header: 'IGST +(18% Tax)', key: 'igst', width: 20 },
                        { header: 'SGST +(9% Tax)', key: 'sgst', width: 20 },
                        { header: 'CGST +(9% Tax)', key: 'cgst', width: 20 },
                        { header: 'Total Tax Amount', key: 'tax', width: 20 },
                        { header: 'Total Invoice Amount', key: 'total', width: 20 },
                    ];
                    //const row = worksheet.lastRow;
                    //console.log(worksheet.getRow())


                    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                        row.eachCell(function (cell, colNumber) {
                            if (colNumber == 1) { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" }, }; }
                            if (colNumber == 2) { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" }, }; }
                            if (colNumber == 3) { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" }, }; }
                            if (colNumber == 4) { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" }, }; }
                            if (colNumber == 5) { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" }, }; }
                            if (colNumber == 6) { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" }, }; }
                            if (colNumber == 7) { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" }, }; }
                            cell.font = {
                                name: "Arial",
                                family: 2,
                                bold: true,
                                size: 10,
                            };
                            cell.alignment = {
                                vertical: "middle",
                                horizontal: "center",
                            };
                            cell.border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' }
                            };
                        });
                    });
                    //   const rows = worksheet.getColumn(1);
                    //     const rowsCount = rows['_worksheet']['_rows'].length;
                    //     console.log(rowsCount)
                    // const balDue = worksheet.getColumn('total')
                    // balDue.eachCell(function (cell, colNumber) {

                    //     if (cell.value == 53100) {
                    //         cell.fill = {
                    //             type: 'gradient',
                    //             gradient: 'angle',
                    //             degree: 0,
                    //             stops: [
                    //                 { position: 0, color: { argb: 'ffffff' } },
                    //                 { position: 0.5, color: { argb: 'cc8188' } },
                    //                 { position: 1, color: { argb: 'fa071e' } }
                    //             ]
                    //         };
                    //     }
                    // });
                    // worksheet.getRow(1).fill = {
                    //     type: 'pattern',
                    //     pattern:'solid',
                    //     fgColor:{ argb:'FFFF00' }
                    // }
                    // Add Array Rows
                    //console.log(worksheet.getRow())
                    worksheet.addRows(AddDataRow);

                    workbook.xlsx.write(res)
                        .then(function () {
                            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                            res.setHeader('Content-Disposition', `attachment; filename=${fdate}_TO_${ldate}_invoiceSACCode.xlsx`);
                            res.status(200).end();
                        })
                        .catch(err => {
                            console.error('Error writing Excel file:', err);
                            res.status(500).send('Failed to generate Excel file');
                        });


                    // res.setHeader(
                    //   "Content-Type",
                    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    // );
                    // res.setHeader(
                    //   "Content-Disposition",
                    //   "attachment; filename=" + fdate+'_TO_'+ldate+'_'+"invoiceSACCode.xlsx"
                    // );
                    // writablestream.on("finish", function () {
                    //     res.json({
                    //         downloadUrl: `${BASE_URL}/files/export/invoice.csv`,
                    //     });
                    // });
                    // workbook.xlsx.write(res).end();
                    // return 'Hello';
                    // return workbook.xlsx.write(res).then(function () {
                    //     res.status(200).end();
                    //   });
                    //});
                }
            });
    } catch (error) {
        res.status(401).json(error)
    }

}
exports.xlsxDataTaxReport = async (req, res) => {
    try {
        var mysort = { _id: -1 };
        const fdate = req.query.fromdate || ""
        const ldate = req.query.todate || ""
        const sacCode = req.query.saccode || ""
        if (fdate != '' && ldate != '') {
            if (sacCode != '') {
                var query = {
                    createdAt: {
                        $gte: fdate ? fdate : '',
                        $lte: ldate ? ldate : ''
                    },
                    service_code: sacCode
                }
            } else {
                var query = {
                    createdAt: {
                        $gte: fdate ? fdate : '',
                        $lte: ldate ? ldate : ''
                    },
                }
            }
        } else {
            var query = {}
        }
        await invoicedb.find(query)
            .sort(mysort)
            .populate({ path: 'customer', select: ['name', 'address', 'gstno'] })
            .populate({ path: 'tax', select: 'tax' })
            .populate({ path: 'service', select: ['sr_name', 'price', 'qty', 'sac_code'] })
            .then(function (result) {
                if (result.length > 0) {
                    let AddDataRow = [];
                    var index = 2;
                    result.forEach((obj) => {
                        obj.profileName_rate.map((profile) => {
                            var subtotal = parseInt(profile.rate)
                            var totaltax = parseInt(subtotal * 18 / 100);
                            var total = parseInt(totaltax + subtotal);
                            AddDataRow.push({
                                createdAt: dateFormat(obj.createdAt, 'dd-mm-yyyy'),
                                invoice: obj.invoice,
                                sacCode: obj.service_code.toString(),
                                customer: obj.customer.name,
                                gst: obj.customer.gstno,
                                // tax_type:(obj.tax == 1 ) ? '18% (IGST)': '18% (SGST 9% + CGST 9%)',
                                amount: (obj.status) ? subtotal : 0,
                                igst: (obj.status) ? (obj.tax == 1) ? profile.rate * 18 / 100 : '' : 0,
                                sgst: (obj.status) ? (obj.tax == 2) ? profile.rate * 9 / 100 : '' : 0,
                                cgst: (obj.status) ? (obj.tax == 2) ? profile.rate * 9 / 100 : '' : 0,

                                alligst: (obj.status) ? (obj.tax == 1) ? profile.rate * 18 / 100 : 0 : 0,
                                allsgst: (obj.status) ? (obj.tax == 2) ? profile.rate * 9 / 100 : 0 : 0,
                                allcgst: (obj.status) ? (obj.tax == 2) ? profile.rate * 9 / 100 : 0 : 0,
                                tax: (obj.status) ? totaltax : 0,
                                total: (obj.status) ? total : 0
                            });

                        });

                    });

                    var alltotaltax = 0; var allsubtotal = 0; var alltotal = 0; var alligst = 0; var allsgst = 0; var allcgst = 0;
                    AddDataRow.forEach(function (element) {
                        if (element.tax != '' && element.amount != '' && element.total != '') {
                            alltotaltax = parseInt(alltotaltax + element.tax)
                            allsubtotal += parseInt(element.amount)
                            alltotal += parseInt(element.total)
                            alligst += parseInt(element.alligst)
                            allsgst += parseInt(element.allsgst)
                            allcgst += parseInt(element.allcgst)
                        }
                    });

                    AddDataRow.push({
                        createdAt: '',
                        invoice: '',
                        sacCode: '',
                        customer: '',
                        gst: '      ' + '      ' + '      ' + '      ' + '         ' + 'Total',
                        // tax_type:'Total',
                        igst: alligst,
                        sgst: allsgst,
                        cgst: allcgst,
                        amount: allsubtotal,
                        tax: alltotaltax,
                        total: alltotal
                    });
                    let workbook = new excel.Workbook();
                    let worksheet = workbook.addWorksheet("Tax Report");

                    worksheet.columns = [
                        { header: 'INV Date', key: 'createdAt', width: 12 },
                        { header: 'Invoice', key: 'invoice', width: 10 },
                        { header: 'SAC Code', key: 'sacCode', width: 25 },
                        { header: 'Customer Name', key: 'customer', width: 30 },
                        { header: 'GST No', key: 'gst', width: 20 },
                        // {header: 'Tax %', key: 'tax_type', width: 25},
                        { header: 'Invoice Amount', key: 'amount', width: 20 },
                        { header: 'IGST +(Tax 18%)', key: 'igst', width: 20 },
                        { header: 'SGST +(Tax 9%)', key: 'sgst', width: 20 },
                        { header: 'CGST +(Tax 9%)', key: 'cgst', width: 20 },
                        { header: 'Total Tax Amount', key: 'tax', width: 20 },
                        { header: 'Total Invoice Amount', key: 'total', width: 20 },
                    ];
                    //const row = worksheet.lastRow;
                    //console.log(worksheet.getRow())

                    worksheet.getRow(1).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        size: 25,
                        italic: true,
                        font: 'bold',
                        fgColor: { argb: 'FFFF00' }
                    }
                    // worksheet.getRow(1).eachCell((cell) => {
                    //     cell.font = {bold: true};
                    // });
                    // Add Array Rows
                    worksheet.addRows(AddDataRow);

                    res.setHeader(
                        "Content-Type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    );
                    res.setHeader(
                        "Content-Disposition",
                        "attachment; filename=" + fdate + '_TO_' + ldate + '_' + "invoiceTaxReport.xlsx"
                    );
                    // writablestream.on("finish", function () {
                    //     res.json({
                    //         downloadUrl: `${BASE_URL}/files/export/invoice.csv`,
                    //     });
                    // });
                    // workbook.xlsx.write(res).end();
                    // return 'Hello';
                    return workbook.xlsx.write(res).then(function () {
                        res.status(200).end();
                    });
                    //});
                }
                // else{
                //     res.status(401).json({message:'No data',success: false,});
                // }
            });
    } catch (error) {
        res.status(401).json(error)
    }

}