const { Queue, Worker } = require('bullmq')
const emails = require('../emails/accounts')
const Task = require('../models/task')


const QUEUE_NAME = "EmailScheduler"
const connection = {
    host: "127.0.0.1",
    port: 6379
}

const EmailQueue = new Queue(QUEUE_NAME, connection);

const scheduleEmails = async (id, delay, email, description) => {
    try {
        await EmailQueue.add(id, { email, description, id }, { delay: delay });
    } catch (error) {
        console.log(error)
    }
}


// Worker code
new Worker(QUEUE_NAME, async job => {
    try {
        const { email, description, id } = job.data
        const task = await Task.findById(id).populate('owner')
        if (!task.completed) {
            emails.sendAlertMail(email, description, task.owner.name)
        }
    } catch (error) {
        console.log(error)
    }

}, {connection});


module.exports = scheduleEmails