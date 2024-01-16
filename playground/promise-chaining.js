require('../src/db/mongoose.js')
const Task = require('../src/models/task.js')
const { findByIdAndDelete, countDocuments } = require('../src/models/user.js')


// // y we didnt wrap it in app.patch (if we had updated instead of deleting), in this we aint getting anything back so no get- so whats task
// Task.findByIdAndDelete('65a04db451db6318d62ea86c').then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed : false})
// }).then((result) => {
//      console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndUpdate = async (id) => {
    await Task.findByIdAndDelete(id)
    return await Task.countDocuments({completed : false})
    //how does non blocking work when u dont want to chain them...u dont put that code under await
}

deleteTaskAndUpdate("65a27b4325f78fa15014e6e1").then((result) => {
    console.log('result' + result)
}).catch((e) => {
    console.log(e)
})