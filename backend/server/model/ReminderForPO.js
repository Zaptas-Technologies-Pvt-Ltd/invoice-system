const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReminderForPOSchema = new Schema({
  poId: { type: Schema.Types.ObjectId, ref: 'POCreate', required: true },
  pono: String,             // quick reference to PO number
  profileName: String,
  rate: String,
  remark: String,
  reminderRequired: String, // "Yes" or "No"
  reminderDate: String,    // e.g. "2025-07-29"
  invoiceCreated: { type: Boolean, default: false },

  // New fields
  statusActive: { type: Boolean, default: true },          // true: active, false: disabled
  reminderSuccessful: { type: Boolean, default: false },   // true: mail sent successfully

  // optional: track each reminder stage
  reminderSent1: { type: Boolean, default: false },
  reminderSent3: { type: Boolean, default: false },
  reminderSent5: { type: Boolean, default: false },
}, { timestamps: true });

ReminderForPOSchema.index({ reminderDate: 1 });

module.exports = mongoose.model('ReminderForPO', ReminderForPOSchema);
