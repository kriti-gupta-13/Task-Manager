const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: { 
        type : String,
        required : true,
        trim : true
    },
    mail: {
        type : String,
        required : true,
        unique : true,
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
            } // can add min max too
        } 
    },
    //stores array of tokens
    tokens : [{
            token : {
                type : String,
                required : true //expired token also part of it ? their can be cases when no active token

            }
        }]
})

userSchema.methods.toJSON = function() { //toJSON is called automatically when stringifying the res therefore dont need to explicitly call it anywhere 
    const user  = this 
    const userObject = user.toObject() // to remove uneccessary stuff and act on it?

    delete userObject.password
    delete userObject.tokens

    return userObject

}  


userSchema.methods.generateAuthToken = async function() {   // didnt use arrow fun cuz need to use "this"
    const user = this
    const token = jwt.sign({id : user._id.toString()}, 'secret', {expiresIn : '7 days'})
    
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}

userSchema.statics.findByCredentials = async (mail, password) => { // statics is used when function is on model(User.function) whereas schema.method used when function is on specific instance of model (user1.function)

    const user = await User.findOne({ mail }) // mail: mail can be written as mail
    
    if(!user) {
        throw new Error('Unable to login') // where this will be printed - its not in console or res? - throws error to catch; if not defined here then to parent catch
    }
    
    const isMatch = await bcryptjs.compare(password, user.password)
    
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

// hashing password before saving
userSchema.pre('save', async function (next) { // cannot use arrow func cuz does not support "this" binding
    const user = this //refers to document being saved

    if (user.isModified('password')) {   // isModified will be true if password created or updated
        user.password = await bcryptjs.hash(user.password, 8)
    }

    next() // signifies end of function so the event (here "save") can run, w/o next save wont run
} )

const User = mongoose.model('User', userSchema)

module.exports = User