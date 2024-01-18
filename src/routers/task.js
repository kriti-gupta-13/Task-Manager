const express = require('express')
const router = express.Router()
const Task = require('../models/task')


router.post('/tasks', async (req,res) => {
    const task = new Task(req.body)
    
    try{
        await task.save()
        res.status(201).send(task)
    }
    
    catch(e) {
        res.status(400).send(e)   
    }
})

router.get('/tasks', async (req, res) => {

    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }
    
    catch(e) {
        res.status(500).send(e) 
    }
})

router.get('/tasks/:id', async (req, res) => {   
    const _id = req.params.id 
    
    try{
        const task = await Task.findById(_id)
            if(!task) {
                // when no such id in db
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


router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    const allowedUpdates = ["description", "completed"]
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate) {
        return res.status(404).send("Invalid updates")
    }

    try{
        const task = await Task.findById(_id)

        if (!task){
            return res.status(404).send('no task with the id exist')
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


router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    
    try{
        const task = await Task.findByIdAndDelete(_id)
        if(!task) {
            return res.status(404).send('no task with the id exist')
        }
        res.send()
    }
    catch(e) {
        res.status(400).send(e) // for when id str is invalid; no where account for 500
    }

})


module.exports = router