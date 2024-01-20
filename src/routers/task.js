const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth.js')



router.post('/tasks', auth, async (req,res) => {
    
    const task = new Task({
        ...req.body, // spread operator - spreads iterable into individual elements
        owner : req.user._id
    })
    
    try{
        await task.save()
        res.status(201).send(task)
    }
    
    catch(e) {
        res.status(400).send(e)   
    }
})

router.get('/tasks', auth, async (req, res) => {

    try{
        const tasks = await Task.find({owner : req.user._id})
        res.send(tasks)
    }
    
    catch(e) {
        res.status(500).send(e) 
    }
})

router.get('/tasks/:id', auth, async (req, res) => {   
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


router.patch('/tasks/:id', auth, async (req, res) => {

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


router.delete('/tasks/:id', auth, async (req, res) => {
    
    try {
        const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id })
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e) {
        res.status(500).send() 
    }

})


module.exports = router