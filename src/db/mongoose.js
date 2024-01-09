const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");

const User = mongoose.model('User', {
    name: String,
    
    age : Number
    
})

// const user1 = new User ({
//     name : 'shruti',
//     age : 'h'

// })
// user1.save().then((me) => {
//     console.log(me)
// }).catch((error) => {
//     console.log('error ', error)
// })

const Task = mongoose.model('Task',{
    description : {
        type : String
    },
    completed : {
        type : Boolean
    }

})

const task1 = new Task({
    description : 'get groceries',
    completed : false
})

task1.save().then((task1) => {
    console.log(task1)
}).catch((error) => {
    console.log('error', error)
})
