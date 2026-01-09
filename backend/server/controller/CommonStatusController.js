const mongoose = require('mongoose');
const customerdb = require('../model/customer');
const companydb = require('../model/company');
const servicesdb = require('../model/services');
const taxdb = require('../model/tax');
const invoicedb = require('../model/invoice');
const counterdb = require('../model/counter');
const POCreatedb = require('../model/POModel');
const NoteCreatedb = require('../model/NoteModel');
const dateTime = require('node-datetime');
const dateFormat = require('dateformat');
const excel = require('exceljs');
const url = require('url');

// ✅ Update Status Handler
exports.updateStatus = async (req, res) => {
    try {
        const ids = req.params.id;
console.log("here")
        if (!ids || !ids.includes('-')) {
            return res.status(400).send({ message: "Invalid ID format", success: false });
        }

        const [id, status, type] = ids.split("-");

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid Object ID", success: false });
        }

        let dbAllow;
        if (type === 'po') {
            dbAllow = POCreatedb;
        } else if (type === 'note') {
            dbAllow = NoteCreatedb;
        } else {
            return res.status(400).send({
                message: "Invalid type specified!",
                success: false,
            });
        }

        const statusUpdate = status === '1';

        const result = await dbAllow.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { status: statusUpdate } }
        );
        

        if (result.modifiedCount === 0) {
            return res.status(404).send({
                message: "No matching document found",
                success: false,
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Status updated successfully',
        });

    } catch (error) {
        console.error("Update Status Error:", error);
        return res.status(500).send({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ✅ Update Delete Handler
exports.updateDelete = async (req, res) => {
    try {
        const ids = req.params.id;

        if (!ids || !ids.includes('-')) {
            return res.status(400).send({ message: "Invalid ID format", success: false });
        }

        const [id, , type] = ids.split("-"); // status is ignored since we always delete

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid Object ID", success: false });
        }

        let dbAllow;
        if (type === 'po') {
            dbAllow = POCreatedb;
        } else if (type === 'note') {
            dbAllow = NoteCreatedb;
        } else {
            return res.status(400).send({
                message: "Invalid type specified!",
                success: false,
            });
        }

        const result = await dbAllow.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "No matching document found to delete",
                success: false,
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Document deleted successfully',
        });

    } catch (error) {
        console.error("Delete Error:", error);
        return res.status(500).send({
            message: "Internal Server Error",
            success: false,
        });
    }
};

