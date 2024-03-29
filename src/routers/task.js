const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const middlewares = require('../middleware/auth.js')
const moment = require('moment')
const scheduleEmails = require('../utils/scheduler')




router.post('/tasks', middlewares.cookieAuth, async (req,res) => {
    try{
    const taskData = {
        ...req.body, // spread operator - spreads iterable into individual elements
        owner : req.user._id
    }
    
    const dueDate = req.body.dueDate
    const dueDateTime = moment(dueDate, 'YYYY-MM-DD HH:mm') // change format to fronted
    taskData.dueDate = dueDateTime.toDate()

    const task = new Task(taskData)
    
    await task.save()
    
    const timeToSendEmail = moment(task.dueDate).subtract(5, 'minutes')
    const timeNow = moment().utc().format()
    const delay = timeToSendEmail.diff(timeNow)

    await scheduleEmails(task._id, delay, req.user.mail, task.description)

    res.status(201).send({task})
    }
    
    catch(e) {
        console.log(e)
        res.status(400).send(e)   
    }
})
//GET /tasks?completed=false
//GET /tasks?limit=2&skip=2
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', middlewares.auth, async (req, res) => {

    try{
        const match = {}
        const sort = {}

        if (req.query.completed) {
            match.completed = JSON.parse(req.query.completed) 
            // parse converts string "true" to boolean true
            // only works when given true or false; throw error on any other   
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1]
        }
        await req.user.populate({
            path : 'tasks',
            match, //match option can specify tasks we wanna match; match cannot be under options? no need of if condition then
            options : {
                limit : parseInt(req.query.limit), //limits no of result per page
                skip : parseInt(req.query.skip), // if skip is 3 and limit 3 it will show second pg; skip is 6 then 3rd pg
                sort 
            }        
            
        })
        res.send(req.user.tasks)
    }
    
    catch(e) {
        res.status(500).send(e) 
    }
})

router.get('/tasks/:id', middlewares.auth, async (req, res) => {   
    const _id = req.params.id 
    
    try{
        
        const task = await Task.findOne({_id , owner : req.user._id})
            
        if(!task) {
                return res.status(404).send()
            }
            res.send(task)
    }
    
    catch(e){
        if(e.name === 'CastError'){
            //for when say id inputed is not of 12 bytes
            return res.status(400).send('Invalid id')
        }
        res.status(500).send(e) 
    }
})


router.patch('/tasks/:id', middlewares.auth, async (req, res) => {

    const allowedUpdates = ["description", "completed"]
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate) {
        return res.status(404).send("Invalid updates")
    }

    try{
        const task = await Task.findOne({_id : req.params.id , owner : req.user._id})

        if (!task){
            return res.status(404).send()
        }

        //const updatedTask = await Task.findByIdAndUpdate(_id, req.body, {new : true, runValidators: true}) 
        updates.forEach((update) => task[update] = req.body[update])

        await task.save()
        
        res.send(task)

    }
    catch(e) {
        res.status(400).send(e) // did not mentioned 500 or server issues
    }
})

router.post('/tasks/mark-as-done/', middlewares.cookieAuth, async (req, res) => {
    try{
        console.log(req.body.taskId)
        const task = await Task.findOne({_id : req.body.taskId })
        task.completed = true
        await task.save()
        
        res.send({task})

    }catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})


router.delete('/task', middlewares.cookieAuth, async (req, res) => {
    
    try {
        const task = await Task.findOneAndDelete({_id : req.body.taskId })
        if(!task) {
            return res.status(404).send()
        }
        res.send({task})
    }
    catch(e) {
        res.status(500).send() 
    }

})


module.exports = router