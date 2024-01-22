const nodemailer = require('nodemailer');

const transporter = function () {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'kritisg2014@gmail.com',
          pass: 'oapc ttoe kahb tazs'
        }
      })
}


const sendMail = (mailOptions) => {
    const transporterObject = transporter()
    transporterObject.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}


const sendWelcomeMail = (mail,name) => {
    var mailOptions = {
        from: 'kritisg2014@gmail.com',
        to: mail,
        subject: 'Thanks for joining!',
        text: `Welcome to the app, ${name}`
      };
      sendMail(mailOptions)
}

const sendDeleteMail = (mail,name) => {
    var mailOptions = {
        from: 'kritisg2014@gmail.com',
        to: mail,
        subject: 'We are sorry to see you leave',
        text: `We hope to see you back again someday, ${name}!`
      };
      sendMail(mailOptions)
}

module.exports = {
    sendWelcomeMail,
    sendDeleteMail
}
