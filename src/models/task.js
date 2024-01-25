const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    
        description : {
            type : String,
            required : true,
            trim : true
        },
        completed : {
            type : Boolean,
            default : false
        },
        dueDate : {
            type : Date,
            required: true
        },
        owner : {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref : 'User' // exact name of collection we wanna link to
            // how it knew to connect value in owner to id field of user 
        }
}, {
    timestamps : true
})


const Task = mongoose.model('Task', taskSchema)

module.exports = Task