const express = require('express')
require('./db/mongoose.js') // to ensure mongoose.js runs so mongoose gets connected to database
const User = require('./models/user.js')
const Task = require('./models/task.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body)


    try{
        await user.save()
        console.log(user)
        res.status(201).send(user) // will go into res.body
    }

    catch(e){
        res.status(400).send(e) //y hardcode 400, y not 500? could be other error too; y we had to specify ; y 200 was coming when clearly it was an error   
    }
})

app.get('/users', async (req, res) => {

    try{
    const users = await User.find({})
    res.send(users)
    }

    catch(e) {
        res.status(500).send(e) 
    }
})

app.get('/users/:id', async (req, res) => {   // : before dynamic values
    const _id = req.params.id // mongoose automatically converts string id to objct id

    try{
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    }

    catch(e) {
        if(e.name === 'CastError'){
            return res.status(400).send('Invalid id')
        }
        res.status(500).send(e) 
    }
})

app.patch('/users/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const updatedUser = await User.findByIdAndUpdate(_id, req.body, {new : true, runValidators: true}) //how would we know it does not check validation, the docs r so poorly written
        
        if (!updatedUser){
            return res.status(404).send('no user with the id exist')
        }
        res.send(updatedUser)

    }
    catch(e) {
        res.status(400).send(e) // did not mentioned 500 or server issues
    }
})

app.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    
    try{
        const user = await User.findByIdAndDelete(_id)
        if(!user) {
            return res.status(404).send('no user with the id exist')
        }
        res.send()
    }
    catch(e) {
        res.status(500).send(e) // sends 500 when invalid id !!!
    }

})

app.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const updatedTask = await Task.findByIdAndUpdate(_id, req.body, {new : true, runValidators: true}) 
        
        if (!updatedTask){
            return res.status(404).send('no task with the id exist')
        }
        res.send(updatedTask)

    }
    catch(e) {
        res.status(400).send(e) // did not mentioned 500 or server issues
    }
})        
    

app.post('/tasks', async (req,res) => {
    const task = new Task(req.body)
    
    try{
        await task.save()
        res.status(201).send(task)
    }
    
    catch(e) {
        res.status(400).send(e)   
    }
})

app.get('/tasks', async (req, res) => {

    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }
    
    catch(e) {
        res.status(500).send(e) 
    }
})

app.get('/tasks/:id', async (req, res) => {   
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

app.delete('/tasks/:id', async (req, res) => {
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

app.listen(port, () => {
    console.log('server is running on port' + port)
})
