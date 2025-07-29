const nodemailer = require('nodemailer');

async function sendGenericEmail(
  to, subject, message, logToDatabase = false, html = null, from = null, cc = null, attachments = null
) {
    console.log("👉 sendGenericEmail called with:");
    console.log({ to, subject, message, html });

    if (!to || !to.trim() || !subject || (!message && !html)) {
        console.error('❌ Validation failed: Missing required fields');
        return { success: false, error: 'Missing required fields: to, subject, or content (message/html)' };
    }

    // configure transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: from || 'kushagra.kamal@zaptas.com',
        to,
        cc,
        subject,
        text: message,
        html,
        attachments: attachments || [],
    };

 

    try {
        const info = await transporter.sendMail(mailOptions);
        if (info.accepted.length > 0) {
            console.log(`✅ Email sent successfully to ${to}: ${info.response}`);
            return { success: true, message: 'Email sent successfully.', info };
        } else {
            console.warn(`⚠️ Email not accepted by server:`, info);
            return { success: false, message: 'Email not accepted by server.', info };
        }
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}: ${error.message}`);
        return { success: false, message: 'Failed to send email.', error: error.message };
    }
}

module.exports = sendGenericEmail;
