var customerdb = require('../model/customer');
var companydb = require('../model/company');
var servicesdb = require('../model/services');
var taxdb = require('../model/tax');
var invoicedb = require('../model/invoice');
var quotationdb = require('../model/quotation');
var counterdb = require('../model/counter');
var POCreatedb = require('../model/POModel');
var dateTime = require('node-datetime');
var dateFormat = require('dateformat');
const excel = require('exceljs');
var url = require('url');
const mongoose = require('mongoose');
const ReminderForPO = require('../model/ReminderForPO');


/* autoIncrement.initialize(connectDB); */


exports.invoicefindByid = (req, res) => {
    const id = req.params.id;
    invoicedb.findById(id).populate({ path: 'customer', select: ['name', 'address', 'gstno'] }).populate({ path: 'tax', select: 'tax' }).populate({ path: 'service', select: ['sr_name', 'price', 'qty', 'sac_code'] })
        .then(invoice => {
            res.send(invoice)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving invoice information" })
        })
}

// Get invoices by customer ID
exports.invoicefindByCustomer = (req, res) => {
    const customerId = req.params.customerId;
    
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return res.status(400).send({
            success: false,
            message: "Invalid customer ID"
        });
    }

    var mysort = { _id: -1 };
    invoicedb.find({ customer: customerId })
        .sort(mysort)
        .select('_id invoice customer po podate tax service_name service_code profileName_rate createdAt')
        .populate({ path: 'customer', select: ['name', 'address', 'gstno'] })
        .then(invoices => {
            res.status(200).send({
                success: invoices.length > 0,
                message: "Data fetched successfully",
                data: invoices,
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Error Occurred while retrieving invoice information",
                data: null
            });
        });
}


exports.invoicefind = (req, res) => {
    var mysort = { _id: -1 };
    const pi = req?.query?.pi || 'false'; // "true" or "false" as a string
    const fdate = req.query.fromdate || "";
    const ldate = req.query.todate || "";
    const sacCode = req.query.saccode || "";

    let query = {};

    // Filter by date range if provided
    if (fdate !== '' && ldate !== '') {
        query.createdAt = {
            $gte: fdate,
            $lte: ldate
        };
    }

    // Filter by service code if provided
    if (sacCode !== '') {
        query.service_code = sacCode;
    }

    // Filter by piperformerinvoice based on pi param
    query.piperformerinvoice = pi === 'true';

    invoicedb.find(query)
        .sort(mysort)
        .populate({ path: 'customer', select: ['name', 'address', 'gstno'] })
        .populate({ path: 'tax', select: 'tax' })
        .populate({ path: 'service', select: ['sr_name', 'price', 'qty', 'sac_code'] })
        .then(invoice => {
            res.status(200).send({
                success: invoice.length > 0,
                message: "Data fetched successfully",
                data: invoice,
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message,
                success: false,
                data: null,
            });
        });
};
async function getNextSequenceValue(callback, piperformerinvoice = false) {
    try {
        const Cusdate = ['01-04-2023', '01-04-2024', '01-04-2025', '01-04-2026', '01-04-2027', '01-04-2028', '01-04-2029'];

        let date_time = new Date();
        let date = ("0" + date_time.getDate()).slice(-2);
        let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
        let year = date_time.getFullYear();
        let currentDate = date + "-" + month + "-" + year;
        let db = piperformerinvoice ? 'piperformerinvoice' : 'invoiceid';

        // Check if the current date matches any of the dates in Cusdate
        if (Cusdate.includes(currentDate)) {
            // Reset sequence_value to 1 if a match is found
            await counterdb.findOneAndUpdate({ _id: db }, { $set: { sequence_value: 1 } });
            console.log('Reset sequence_value to 1');
        }

        // Increment sequence_value
        await counterdb.findOneAndUpdate({ _id: db }, { $inc: { sequence_value: 1 } });

        // Retrieve the updated sequence_value
        const result = await counterdb.findOne({ _id: db });

        // Execute the callback with the updated sequence_value
        if (result) {
            callback(result.sequence_value);
        }
    } catch (error) {
        console.error("Error in getNextSequenceValue:", error);
    }
}

// create and save new user
exports.create = (req, res) => {
    console.log('Request body:', req.body);

    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    const piperformerinvoice = req.body.piperformerinvoice === 'piperformerinvoice' ? true : false;

    getNextSequenceValue(async (data) => {
        try {
            var dt = dateTime.create();
            const poId = req.body.PoObjectId;

            console.log('🔍 Using poId:', poId);

            const isValidPoId = mongoose.Types.ObjectId.isValid(poId);

            // Step 1: mark invoiceCreated in polistdata only if poId is valid
            if (isValidPoId) {
                const profiles = req.body.profilesDetails;
                console.log('📦 profilesDetails:', profiles);

                for (let item of profiles) {
                    console.log('➡ Processing profile item.id:', item.id);

                    if (item.id) {
                        const result = await POCreatedb.updateOne(
                            {
                                _id: new mongoose.Types.ObjectId(poId),
                                "polistdata.id": item.id
                            },
                            { $set: { "polistdata.$.invoiceCreated": true } }
                        );
                        console.log(`✅ updateOne result for item.id=${item.id}: matchedCount=${result.matchedCount}, modifiedCount=${result.modifiedCount}`);
                    } else {
                        console.log('⚠ Skipped profile without item.id:', item);
                    }
                }
            } else {
                console.log('⚠ Skipping POCreatedb update: Invalid poId format');
            }

            // Step 2: create invoice
            const invoice = new invoicedb({
                customer: req.body.customer,
                service: req.body.service,
                service_name: req.body.serviceName,
                service_code: req.body.serviceCode.toString(),
                profileName_rate: req.body.profilesDetails,
                tax: req.body.tax,
                po: req.body.po,
                podate: req.body.podate ? dateTime.create(req.body.podate).format('d-m-Y') : '',
                createdAt: req.body.createdAt ? dateTime.create(req.body.createdAt).format('Y-m-d') : dt.format('Y-m-d'),
                invoice: '00' + data,
                payment: req.body.payment,
                piperformerinvoice: piperformerinvoice
            });

            await invoice.save();
            console.log('✅ Invoice saved successfully with number:', invoice.invoice);

            // Step 3: deactivate reminders only if poId is valid
            if (isValidPoId) {
                const deactivateResult = await ReminderForPO.updateMany(
                    { poId: poId, statusActive: true },
                    { $set: { statusActive: false } }
                );
                console.log(`🛠 Reminders deactivated: matchedCount=${deactivateResult.matchedCount}, modifiedCount=${deactivateResult.modifiedCount}`);
            } else {
                console.log('⚠ Skipping ReminderForPO update: Invalid poId format');
            }

            return res.status(200).send({
                success: true,
                message: 'Invoice created' + (isValidPoId ? ' and reminders deactivated' : '') + ' successfully'
            });

        } catch (err) {
            console.error("❌ Create invoice error:", err);
            return res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating invoice"
            });
        }
    }, piperformerinvoice);
};

async function getNextQuotationSequenceValue(callback, piperformerinvoice = false) {
    try {
        const Cusdate = ['01-04-2023', '01-04-2024', '01-04-2025', '01-04-2026', '01-04-2027', '01-04-2028', '01-04-2029'];

        let date_time = new Date();
        let date = ("0" + date_time.getDate()).slice(-2);
        let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
        let year = date_time.getFullYear();
        let currentDate = date + "-" + month + "-" + year;
        let db = piperformerinvoice ? 'piperformerquotation' : 'quotationid';

        // Check if the current date matches any of the dates in Cusdate
        if (Cusdate.includes(currentDate)) {
            // Reset sequence_value to 1 if a match is found
            await counterdb.findOneAndUpdate({ _id: db }, { $set: { sequence_value: 1 } }, { upsert: true });
            console.log('Reset quotation sequence_value to 1');
        }

        // Increment sequence_value
        await counterdb.findOneAndUpdate({ _id: db }, { $inc: { sequence_value: 1 } }, { upsert: true });

        // Retrieve the updated sequence_value
        const result = await counterdb.findOne({ _id: db });

        // Execute the callback with the updated sequence_value
        if (result) {
            callback(result.sequence_value);
        } else {
            // If no result, create one with sequence_value 1
            await counterdb.create({ _id: db, sequence_value: 1 });
            callback(1);
        }
    } catch (error) {
        console.error("Error in getNextQuotationSequenceValue:", error);
    }
}

// create and save new quotation
exports.quotationCreate = (req, res) => {
    console.log('Request body:', req.body);

    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    const piperformerinvoice = req.body.piperformerinvoice === 'piperformerinvoice' ? true : false;

    getNextQuotationSequenceValue(async (data) => {
        try {
            var dt = dateTime.create();
            const poId = req.body.PoObjectId;

            console.log('🔍 Using poId:', poId);

            const isValidPoId = mongoose.Types.ObjectId.isValid(poId);

            // Step 1: mark invoiceCreated in polistdata only if poId is valid
            if (isValidPoId) {
                const profiles = req.body.profilesDetails;
                console.log('📦 profilesDetails:', profiles);

                for (let item of profiles) {
                    console.log('➡ Processing profile item.id:', item.id);

                    if (item.id) {
                        const result = await POCreatedb.updateOne(
                            {
                                _id: new mongoose.Types.ObjectId(poId),
                                "polistdata.id": item.id
                            },
                            { $set: { "polistdata.$.invoiceCreated": true } }
                        );
                        console.log(`✅ updateOne result for item.id=${item.id}: matchedCount=${result.matchedCount}, modifiedCount=${result.modifiedCount}`);
                    } else {
                        console.log('⚠ Skipped profile without item.id:', item);
                    }
                }
            } else {
                console.log('⚠ Skipping POCreatedb update: Invalid poId format');
            }

            // Step 2: create quotation
            const quotation = new quotationdb({
                customer: req.body.customer,
                service: req.body.service,
                service_name: req.body.serviceName,
                service_code: req.body.serviceCode.toString(),
                profileName_rate: req.body.profilesDetails,
                tax: req.body.tax,
                po: req.body.po,
                podate: req.body.podate ? dateTime.create(req.body.podate).format('d-m-Y') : '',
                createdAt: req.body.createdAt ? dateTime.create(req.body.createdAt).format('Y-m-d') : dt.format('Y-m-d'),
                quotation: '00' + data,
                payment: req.body.payment,
                piperformerinvoice: piperformerinvoice
            });

            await quotation.save();
            console.log('✅ Quotation saved successfully with number:', quotation.quotation);

            // Step 3: deactivate reminders only if poId is valid
            if (isValidPoId) {
                const deactivateResult = await ReminderForPO.updateMany(
                    { poId: poId, statusActive: true },
                    { $set: { statusActive: false } }
                );
                console.log(`🛠 Reminders deactivated: matchedCount=${deactivateResult.matchedCount}, modifiedCount=${deactivateResult.modifiedCount}`);
            } else {
                console.log('⚠ Skipping ReminderForPO update: Invalid poId format');
            }

            return res.status(200).send({
                success: true,
                message: 'Quotation created' + (isValidPoId ? ' and reminders deactivated' : '') + ' successfully'
            });

        } catch (err) {
            console.error("❌ Create quotation error:", err);
            return res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating quotation"
            });
        }
    }, piperformerinvoice);
};

exports.quotationfindByid = (req, res) => {
    const id = req.params.id;
    quotationdb.findById(id).populate({ path: 'customer', select: ['name', 'address', 'gstno'] }).populate({ path: 'tax', select: 'tax' }).populate({ path: 'service', select: ['sr_name', 'price', 'qty', 'sac_code'] })
        .then(quotation => {
            res.send(quotation)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving quotation information" })
        })
}

exports.quotationfind = (req, res) => {
    var mysort = { _id: -1 };
    const pi = req?.query?.pi; // "true", "false", or undefined
    const fdate = req.query.fromdate || "";
    const ldate = req.query.todate || "";
    const sacCode = req.query.saccode || "";

    let query = {};

    // Filter by date range if provided
    if (fdate !== '' && ldate !== '') {
        query.createdAt = {
            $gte: fdate,
            $lte: ldate
        };
    }

    // Filter by service code if provided
    if (sacCode !== '') {
        query.service_code = sacCode;
    }

    // Filter by piperformerinvoice only if pi param is explicitly provided
    // For quotations, if pi is provided, we still want to show all quotations
    // since quotations may not use the piperformerinvoice field the same way as invoices
    // Only filter if we explicitly want to filter by this field
    if (pi !== undefined && pi !== null && pi !== '') {
        // For quotations, show all when pi is provided (don't filter by piperformerinvoice)
        // This allows the quotation list to display regardless of piperformerinvoice value
        // If you want to filter quotations by piperformerinvoice, uncomment the line below:
        // query.piperformerinvoice = pi === 'true' || pi === true;
    }

    quotationdb.find(query)
        .sort(mysort)
        .populate({ path: 'customer', select: ['name', 'address', 'gstno'] })
        .populate({ path: 'tax', select: 'tax' })
        .populate({ path: 'service', select: ['sr_name', 'price', 'qty', 'sac_code'] })
        .then(quotation => {
            res.status(200).send({
                success: true,
                message: "Data fetched successfully",
                data: quotation,
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message,
                success: false,
                data: null,
            });
        });
};

exports.quotationUpdate = (req, res) => {
    const id = req.params.id;

    // Validate quotation ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: "Invalid quotation ID" });
    }

    const updateFields = {};

    // Handle profileName_rate if present
    if (req.body.profileName_rate) {
        updateFields.profileName_rate = req.body.profileName_rate;
    }
   
    if (req?.body?.tax) {
        updateFields.tax = req.body.tax;
    }

    // Handle status if present:
    // can come as boolean, string "active"/"inactive", or string "true"/"false"
    if (req.body.status !== undefined) {
        if (typeof req.body.status === 'boolean') {
            updateFields.status = req.body.status;
        } else if (typeof req.body.status === 'string') {
            const statusLower = req.body.status.trim().toLowerCase();
            if (statusLower === 'active' || statusLower === 'true') {
                updateFields.status = true;
            } else if (statusLower === 'inactive' || statusLower === 'false') {
                updateFields.status = false;
            }
            // else ignore invalid string
        }
    }

    // If no valid fields to update, return graceful response
    if (Object.keys(updateFields).length === 0) {
        return res.status(200).send({
            success: true,
            message: 'Nothing to update',
            data: null
        });
    }

    // Perform the update
    quotationdb.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true } // return updated document
    )
        .then(updatedQuotation => {
            if (!updatedQuotation) {
                return res.status(404).send({ success: false, message: "Quotation not found" });
            }
            res.status(200).send({
                success: true,
                message: 'Quotation updated successfully',
                data: updatedQuotation
            });
        })
        .catch(error => {
            console.error('Error updating quotation:', error);
            res.status(500).send({
                success: false,
                message: error.message || "Some error occurred while updating the quotation"
            });
        });
};



// create and save new customer
exports.customercreate = (req, res) => {

    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }
    // new customer
    const customer = new customerdb({
        name: req.body.cname,
        gstno: req.body.cgst,
        address: req.body.caddress,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true
    })

    // save customer in the database
    customer
        .save(customer)
        .then(data => {
            res.status(200).send({
                success: true,
                message: 'customer create successfully'
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating a create operation"
            });
        });

}


// Update customer
exports.customerupdate = (req, res) => {

    // Validate request
    if (!req.body) {
        return res.status(400).send({ message: "Content cannot be empty!" });
    }

    const id = req.params.id;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid customer ID" });
    }

    customerdb.findByIdAndUpdate(id, {
        name: req.body.cname,
        gstno: req.body.cgst,
        address: req.body.caddress,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true
    }, { new: true }) // 'new: true' returns the updated document
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: `Cannot update customer with ID=${id}. Customer not found!`
                });
            }
            res.status(200).send({
                success: true,
                message: 'Customer updated successfully'
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while updating the customer"
            });
        });
};


// update and save new services
exports.serviceupdate = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({ message: "Content cannot be empty!" });
    }

    const id = req.params.id;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid service ID" });
    }

    // Update service details
    servicesdb.findByIdAndUpdate(id, {
        price: req.body.sprice,
        qty: req.body.sqty,
        sr_name: req.body.sname,
        sac_code: req.body.scode
    }, { new: true }) // 'new: true' to return the updated document
        .then(data => {
            if (!data) {
                return res.status(404).send({ message: "Service not found" });
            }
            res.status(200).send({
                success: true,
                message: 'Service updated successfully',
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while updating the service."
            });
        });
};

// update 


exports.invoiceUpdate = (req, res) => {
    const id = req.params.id;

    // Validate invoice ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: "Invalid invoice ID" });
    }

    const updateFields = {};

    // Handle profileName_rate if present
    if (req.body.profileName_rate) {
        updateFields.profileName_rate = req.body.profileName_rate;
    }
   
    if (req?.body?.tax) {
        updateFields.tax = req.body.tax;
    }

    // Handle status if present:
    // can come as boolean, string "active"/"inactive", or string "true"/"false"
    if (req.body.status !== undefined) {
        if (typeof req.body.status === 'boolean') {
            updateFields.status = req.body.status;
        } else if (typeof req.body.status === 'string') {
            const statusLower = req.body.status.trim().toLowerCase();
            if (statusLower === 'active' || statusLower === 'true') {
                updateFields.status = true;
            } else if (statusLower === 'inactive' || statusLower === 'false') {
                updateFields.status = false;
            }
            // else ignore invalid string
        }
    }

    // If no valid fields to update, return graceful response
    if (Object.keys(updateFields).length === 0) {
        return res.status(200).send({
            success: true,
            message: 'Nothing to update',
            data: null
        });
    }

    // Perform the update
    invoicedb.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true } // return updated document
    )
        .then(updatedInvoice => {
            if (!updatedInvoice) {
                return res.status(404).send({ success: false, message: "Invoice not found" });
            }
            res.status(200).send({
                success: true,
                message: 'Invoice updated successfully',
                data: updatedInvoice
            });
        })
        .catch(error => {
            console.error('Error updating invoice:', error);
            res.status(500).send({
                success: false,
                message: error.message || "Some error occurred while updating the invoice"
            });
        });
};



//edit service

exports.editservice = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({ message: "Content cannot be empty!" });
    }

    const id = req.params.id;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid service ID" });
    }

    console.log(req.body.service_name);

    // Proceed with the update
    invoicedb.update({ _id: mongoose.Types.ObjectId(id) }, {
        service_name: req.body.service_name,
    })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: `Cannot update service with ID=${id}. Service not found!`
                });
            }
            res.status(200).send({
                success: true,
                message: 'Service updated successfully'
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while updating the service"
            });
        });
};


// create and save new services
exports.servicecreate = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }
    // new services
    const services = new servicesdb({
        price: req.body.sprice,
        qty: req.body.sqty,
        sr_name: req.body.sname,
        sac_code: req.body.scode
    })

    // save services in the database
    services
        .save(services)
        .then(data => {
            res.status(200).send({
                success: true,
                message: 'services create successfully'
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating a create operation"
            });
        });

}


// retrieve and return all users/ retrive and return a single user
exports.customerfindByid = (req, res) => {
    const id = req.params.id;
    customerdb.findById(id)
        .then(customer => {
            res.send(customer)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving customer information" })
        })
}


// retrieve and return all users/ retrive and return a single user
exports.customerfind = async (req, res) => {
    try {
        const list = await customerdb.find()
        return res.status(200).send({
            success: true,
            message: "Data fatched successfully",
            data: list,
        });

    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
        });
    }
}

exports.companyfind = (req, res) => {

    companydb.find()
        .then(company => {
            res.send(company)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving company information" })
        })
}

exports.servicesfind = async (req, res) => {

    servicesdb.find()
        .then(services => {
            res.status(200).send(
                {
                    success: (services != '') ? true : false,
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

exports.servicesfindByid = (req, res) => {
    const id = req.params.id;
    servicesdb.findById(id)
        .then(services => {
            res.send(services)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving services information" })
        })
}


exports.taxfind = async (req, res) => {

    taxdb.find()
        .then(tax => {
            res.status(200).send(
                {
                    success: (tax != '') ? true : false,
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

exports.createExcel = (req, res) => {

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var mysort = { _id: -1 };
    invoicedb.find(
        { "createdAt": { $gte: new Date(query.fromdate), $lt: new Date(query.todate) } })
        .sort(mysort)
        .populate({ path: 'customer', select: ['name', 'address', 'gstno'] })
        .populate({ path: 'tax', select: 'tax' })
        .populate({ path: 'service', select: ['sr_name', 'price', 'qty', 'sac_code'] })
        .then(function (result) {
            var collection = [];
            result.forEach(function (data) {
                var totaltax = 0;
                var subtotal = 0;
                var total = 0;
                data.service.forEach(function (element) {
                    totaltax += element.price * 18 / 100;
                    subtotal += element.price;
                    total += (element.price * 18 / 100) + element.price;
                });

                collection.push({
                    createdAt: data.createdAt,
                    invoice: data.invoice,
                    customer: data.customer.name,
                    gst: data.customer.gstno,
                    tax_type: (data.tax == 1) ? '18% (IGST)' : '18% (SGST 9% + CGST 9%)',
                    service: data.service_name.toString(),
                    igst: (data.status) ? (data.tax == 1) ? subtotal * 18 / 100 : '' : 0,
                    sgst: (data.status) ? (data.tax == 2) ? subtotal * 9 / 100 : '' : 0,
                    cgst: (data.status) ? (data.tax == 2) ? subtotal * 9 / 100 : '' : 0,

                    alligst: (data.status) ? (data.tax == 1) ? subtotal * 18 / 100 : 0 : 0,
                    allsgst: (data.status) ? (data.tax == 2) ? subtotal * 9 / 100 : 0 : 0,
                    allcgst: (data.status) ? (data.tax == 2) ? subtotal * 9 / 100 : 0 : 0,

                    amount: (data.status) ? subtotal : 0,
                    tax: (data.status) ? totaltax : 0,
                    total: (data.status) ? total : 0
                });
            });

            var alltotaltax = 0;
            var allsubtotal = 0;
            var alltotal = 0;
            var alligst = 0;
            var allsgst = 0;
            var allcgst = 0;

            collection.forEach(function (element) {
                alltotaltax += element.tax
                allsubtotal += element.amount
                alltotal += element.total
                alligst += element.alligst
                allsgst += element.allsgst
                allcgst += element.allcgst
            });


            collection.push({
                createdAt: '',
                invoice: '',
                customer: '',
                gst: '',
                service: 'Total',
                igst: alligst,
                sgst: allsgst,
                cgst: allcgst,
                amount: allsubtotal,
                tax: alltotaltax,
                total: alltotal
            });

            createExcel(collection).then(function (result) {
                res.download('invoice.xlsx');
            });
        });
}

async function createExcel(data) {
    var dt = dateTime.create();
    var file_path = 'invoice.xlsx';
    try {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('invoice');
        worksheet.columns = [
            { header: 'INV Date', key: 'createdAt', width: 10 },
            { header: 'Invoice', key: 'invoice', width: 10 },
            { header: 'Customer', key: 'customer', width: 30 },
            { header: 'GST No', key: 'gst', width: 30 },
            { header: 'Tax', key: 'tax_type', width: 30 },
            { header: 'Service', key: 'service', width: 70 },
            { header: 'Amount', key: 'amount', width: 10 },
            { header: 'IGST', key: 'igst', width: 10 },
            { header: 'SGST', key: 'sgst', width: 10 },
            { header: 'CGST', key: 'cgst', width: 10 },
            //{header: 'Tax', key: 'tax', width: 10},
            { header: 'Total', key: 'total', width: 10 },
        ];

        data.forEach(invoice => {
            worksheet.addRow(invoice);
        });
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });

        await workbook.xlsx.writeFile(file_path);
        return ({ message: `File created at ${file_path}`, status: "success", status_code: 200 });
    }
    catch (err) {
        throw new Error(err);
    }
}
// Total Listing.......
exports.totalData = async (req, res) => {
    const customerCount = await customerdb.find();
    const serviceCount = await servicesdb.find();
    const invoiceCount = await invoicedb.find();
    const poCount = await POCreatedb.find();

    var sum = 0;

    for (var i = 0; i < invoiceCount.length; i++) {
        ArryAmount = invoiceCount[i].profileName_rate;
        console.log(ArryAmount);
        for (item in ArryAmount) {
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

// Add new function for toggling customer status
exports.toggleCustomerStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { isActive } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid customer ID"
            });
        }

        const updatedCustomer = await customerdb.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).send({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Customer status updated successfully",
            data: updatedCustomer
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message || "Error occurred while updating customer status"
        });
    }
};





