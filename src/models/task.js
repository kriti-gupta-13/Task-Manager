const mongoose = require('mongoose')


const Task = mongoose.model('Task',{
    description : {
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User' // exact name of collection we wanna link to
        // how it knew to connect value in owner to id field of user 
    }

})

module.exports = Task