const nodemailer = require('nodemailer');

function mailer(senderMail, senderPassword, receiversMail, mailSubject, mailText) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderMail,
            pass: senderPassword
        }
    });

    const mailOptions = {
        from: "Bello Gbadebo @ TestimonyBank",
        to: receiversMail,
        subject: mailSubject,
        text: mailText
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = mailer;