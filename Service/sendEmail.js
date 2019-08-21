const nodemailer = require('nodemailer');
const config = require('config');
exports.sendmail = (mailOptions) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: config.get('email'),
            pass: config.get('password')
        }
    });
    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.error('There was an error: ', err);
        } else {
            console.log('Succussfully send email');
        }
    });
};