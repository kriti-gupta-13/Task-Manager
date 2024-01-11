const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api"); // to connect mongoose to databases


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
