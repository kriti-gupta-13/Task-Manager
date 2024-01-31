const nodemailer = require('nodemailer')


const transporter = function () {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'kritisg2014@gmail.com',
          pass: process.env.GMAIL_PASSWORD
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
        subject: 'Excited to see you join Task Manager app',
        text: `Dear ${name},\n\nWelcome to Task Manager! We're thrilled to have you on board.\n\nWith Task Manager, you can organize your tasks, set deadlines, and stay on top of your to-do list effortlessly.\n\nHere are a few key features you can explore:\n- Create and manage tasks easily.\n- Set due dates and receive reminders.\n- Prioritize tasks and mark them as completed.\n\nWe're here to help you stay organized and productive every step of the way.\n\nIf you have any questions or need assistance, feel free to reach out to our support team at kritisg2014@gmail.com. We're always happy to help!\n\nHappy task managing!\n\nBest regards,\nKriti Gupta\nTask Manager Team`
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

// how this would conflict with status. what if done?
const sendAlertMail = (mail, description, name) => {
  try{
    var mailOptions = {
      from: 'kritisg2014@gmail.com',
      to: mail,
      subject: 'Due date in 5 min',
      text: `Dear ${name},\n\nThis is a friendly reminder that you have a task due in the next 5 minutes. Please ensure that you complete the task on time to stay on track with your schedule.\n\nTask Details:\n- Description: ${description}\n\nThank you for using Task Manager to stay organized and productive.\n\nBest regards,\nKriti Gupta\nTask Manager Team`
    };
    sendMail(mailOptions)
  } catch(e) {
    console.log(e)
  }
}

module.exports = {
    sendWelcomeMail,
    sendDeleteMail,
    sendAlertMail
}
