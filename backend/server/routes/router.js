const express = require('express');
const route = express.Router()
const AuthMiddlewares = require('../middlewares/authMiddlewares');
const services = require('../services/render');
const controller = require('../controller/controller');
const AuthController = require('../controller/AuthController');
const ExportCSVController = require('../controller/ExportCSVController');
const ExportxlsxController = require('../controller/ExportxlsxController');
const POCreateController = require('../controller/POCreateController');
const CommonStatusController = require('../controller/CommonStatusController');

/**
 *  @description Root Route
 *  @method GET /
 */

route.get('/api', (req, res) => {
    res.send({ message: "test from backend!" });
});
route.post('/apiq', (req, res) => {
    res.send({ message: "test from backend!" });
});


// API
route.get('/api/customer', AuthMiddlewares, controller.customerfind);
route.get('/api/customerByid/:id', controller.customerfindByid);

route.get('/api/company',AuthMiddlewares, controller.companyfind);
route.get('/api/services',AuthMiddlewares, controller.servicesfind);
route.get('/api/servicesByid/:id', controller.servicesfindByid);

route.get('/api/tax',AuthMiddlewares, controller.taxfind);

//Api Invoice
route.post('/api/invoice', controller.create);
route.get('/api/getInvoice',AuthMiddlewares, controller.invoicefind);
route.get('/api/getInvoiceByid/:id', controller.invoicefindByid);

route.get('/api/invoice/download/', controller.createExcel);

//Api create
route.post('/api/service/create', controller.servicecreate);
route.post('/api/customer/create', controller.customercreate);

//Api update
route.put('/api/service/update/:id', controller.serviceupdate);
route.put('/api/customer/update/:id', controller.customerupdate);
route.put('/api/editservice/update/:id', controller.editservice);

route.put('/api/invoice/update/:id',controller.invoiceUpdate);

//Company and Login
route.post('/api/profileCreate',AuthController.companyCreate);
route.post('/api/profileUpdate/:id',AuthController.companyUpdate);
route.post('/api/getprofileDetail',AuthController.companyDetail);
route.post('/api/authLogin',AuthController.login);
route.put('/api/updatePass/:id',AuthController.passwordUpdate);

// PO Create
route.post('/api/pocreate',POCreateController.createPO);
route.get('/api/po-list',AuthMiddlewares,POCreateController.PoTotalLists);
route.get('/api/poList/?:id',AuthMiddlewares,POCreateController.PoLists);
route.get('/api/poDetail/:id',AuthMiddlewares,POCreateController.PoListDetail);


///Excel Data
route.get('/api/exportExcel',ExportCSVController.excelData)
route.get('/api/exportExcelxlsxAll',ExportxlsxController.xlsxDataAll)
route.get('/api/exportExcelxlsxSACCode',ExportxlsxController.xlsxDataSACCode)
route.get('/api/exportExcelxlsxTaxReport',ExportxlsxController.xlsxDataTaxReport)


// Total Data.......
route.get('/api/totals',AuthMiddlewares, controller.totalData);

// Common Status Update.............
route.post('/api/commonStatus/update/:id',CommonStatusController.updateStatus);
route.post('/api/commonDelete/update/:id',CommonStatusController.updateDelete);


module.exports = route