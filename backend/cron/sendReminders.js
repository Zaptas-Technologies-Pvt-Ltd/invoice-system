const cron = require('node-cron');
const moment = require('moment');

const sendGenericEmail = require('../utility/email');
const ReminderForPO = require('../server/model/ReminderForPO');

async function runReminderJobNow() {
  console.log(`\n[${new Date().toLocaleString()}] Running reminder job manually`);

  const todayDate = moment().format('YYYY-MM-DD');

  try {
    const reminders = await ReminderForPO.find({
      reminderRequired: "Yes",
      statusActive: true,
      reminderSuccessful: false,
      reminderDate: todayDate
    });

    console.log(`Found ${reminders.length} reminders scheduled for today (${todayDate})`);

    for (const item of reminders) {
      try {
        const res = await sendGenericEmail(
          process.env.remaindermail,  // to
          `Reminder: ${item.profileName} (PO: ${item.pono})`, // subject
          `This is your scheduled reminder for today: ${item.reminderDate}`, // text fallback
          false, // logToDatabase
          `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #007BFF;">📌 Reminder Notification</h2>
    <p>Dear Customer,</p>
    <p>This is a friendly reminder for <strong>${item.profileName}</strong> under PO <strong>${item.pono}</strong>.</p>
    <p><strong>Reminder Date:</strong> ${item.reminderDate}</p>
    <hr style="border: none; border-top: 1px solid #eee;" />
    <p>If you have any questions, please feel free to contact us.</p>
    <p style="margin-top: 20px;">Best regards,<br /><strong>Kushagra Kamal</strong></p>
  </div>
  `
        );

         if (res.success) {
      await ReminderForPO.updateOne(
        { _id: item._id },
        { $set: { reminderSuccessful: true } }
      );
      console.log(`✅ Reminder sent & marked as successful for ${item.profileName} (${item._id})`);
    } else {
      console.warn(`⚠️ Mail not sent successfully for ${item.profileName} (${item._id}):`, res.message || res.error);
    }

        console.log(`✅ Reminder sent & marked as successful for ${item.profileName} (${item._id})`);
      } catch (mailErr) {
        console.error("❌ Error sending mail:", mailErr);
      }
    }
  } catch (err) {
    console.error("❌ Error fetching reminders:", err);
  }

  console.log(`Reminder job finished.\n`);
}

function startReminderJob() {
  // 🧠 Schedule daily at 10:00 AM
  cron.schedule('0 10 * * *', runReminderJobNow);
  console.log('✅ Reminder cron job scheduled to run every day at 10:00 AM');
}

module.exports = { startReminderJob, runReminderJobNow };
