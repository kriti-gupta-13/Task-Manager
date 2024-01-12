const express = require('express')
require('./db/mongoose.js') // to ensure mongoose.js runs so mongoose gets connected to database
const User = require('./models/user.js')
const Task = require('./models/task.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)


    user.save().then(() => {
        res.status(201).send(user) // where r u sending this ?

    }).catch((e) => {
        res.status(400).send(e) //y hardcode 400, y not 500? could be other error too; y we had to specify ; y 200 was coming when clearly it was an error
        
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((e) => {
        res.status(500).send(e) 
    })
})

app.get('/users/:id', (req, res) => {   // : before dynamic values
    const _id = req.params.id // mongoose automatically converts string id to objct id
    
    User.findById(_id).then((user) => {
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e) => {
        if(e.name === 'CastError'){
            return res.status(400).send('Invalid id')
        }
        res.status(500).send(e) 
    })
})

app.post('/tasks', (req,res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
        
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send(e) 
    })
})

app.get('/tasks/:id', (req, res) => {   
    const _id = req.params.id 
    
    Task.findById(_id).then((task) => {
        if(!task) {
            // when id structure is valid but no such id in db
            return res.status(404).send()
        }
        res.send(task)
    }).catch((e) => {
        if(e.name === 'CastError'){
            //for when say id inputed is not of 12 bytes
            return res.status(400).send('Invalid id')
        }
        res.status(500).send(e) 
    })
})

app.listen(port, () => {
    console.log('server is running on port' + port)
})
