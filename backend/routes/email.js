const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/send-email', async (req, res) => {
    const { subject, recipient } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject,
        text: 'This is a test email sent from the Node.js server using Nodemailer.'
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ success: true, message: 'Email sent successfully' });
        }
    });
});

module.exports = router;
