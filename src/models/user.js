const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
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

userSchema.pre('save', async function (next) { // cannot use arrow func cuz does not support this binding
    this //refers to document being saved



    next() // signifies end of function so the event (here "save") can run, w/o next save wont run
} )

const User = mongoose.model('User', userSchema)

module.exports = User