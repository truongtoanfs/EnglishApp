// function handler: do something when path matched

const Email = require('../models/Vocabulary');

class EmailController {
  // [POST] /email
  index(req, res) {
    if (req.body.sendEmail === 'on') {
      let countSendedMails = 0;
      var countTime = setInterval(function () {
        let today = new Date();
        const currentHours = today.getHours();
        const currentMinutes = today.getMinutes();
        const sendMailHours = req.body.hour.slice(0, 2) * 1;
        const sendMailMinutes = req.body.hour.slice(3) * 1;
        console.log(currentHours, currentMinutes);

        if (currentHours === sendMailHours && currentMinutes === sendMailMinutes && countSendedMails === 0) {
          countSendedMails = 1;
          const nodeMailer = require('nodemailer');
          const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'toan.truongvanfs@gmail.com',
              pass: 'lviavnqyjipyfdaj'
            }
          });
          const mailOptions = {
            from: 'toan.truongvanfs@gmail.com',
            to: 'truongtoan97vip@gmail.com',
            subject: 'New Vocabulary',
            text: 'Setup is ok'
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          
        }
        if (currentHours === 0 && currentMinutes ===  0) {
          countSendedMails = 0;
        }
      }, 1000)
    } else {
      clearInterval(countTime);
    }
    if (req.body)
      res.send('ok');
  }


}

module.exports = new EmailController();
