const { Queue, Worker } = require('bullmq')
const emails = require('../emails/accounts')


const QUEUE_NAME = "EmailScheduler"
const connection = {
    host: "127.0.0.1",
    port: 6379
}

const EmailQueue = new Queue(QUEUE_NAME, connection);

const scheduleEmails = async (id, delay, email, description) => {
    try {
        await EmailQueue.add(id, { email, description }, { delay: delay });
    } catch (error) {
        console.log(error)
    }
}


// Worker code
new Worker(QUEUE_NAME, async job => {
    try {
        const { email, description } = job.data
        emails.sendAlertMail(email, description)
    } catch (error) {
        console.log(error)
    }

}, {connection});


module.exports = scheduleEmails