const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");

const User = mongoose.model('User', {
    name: { 
        type : String,
        required : true,
        trim : true
    },
    mail: {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minLength : [7, 'minimum length of password should be 7'],
        validate(value) {
            if (validator.equals(value.toLowerCase(),'password')) {
                throw new Error('password cannot be equal to "password"')
            }
        }
    },
    
    age : {
        type : Number,
        default : 0,
        validate(value){
            if(value < 0){
                throw new Error('age must be positive')
            }
        }

        //add min and max or not negative 
    }

    
})

// const user1 = new User ({
//     name : 'priya  ',
//     mail : '  Priya@gmail.com',
//     password : 'priyagupta'


// })
// user1.save().then((me) => {
//     console.log(me)
// }).catch((error) => {
//     console.log('error ', error)
// })

const Task = mongoose.model('Task',{
    description : {
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    }

})

const task1 = new Task({
    description : '   get groceries  ',
    completed : false
})

task1.save().then((task1) => {
    console.log(task1)
}).catch((error) => {
    console.log('error', error)
})
