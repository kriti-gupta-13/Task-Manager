//creates express app and gets it running

const express = require('express')
require('./db/mongoose.js') // to ensure mongoose.js runs so mongoose gets connected to database
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')

const app = express() //creates express app 
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter) 
app.use(taskRouter)


app.listen(port, () => {
    console.log('server is running on port' + port)
})
