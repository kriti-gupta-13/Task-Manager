const express = require('express')
require('./db/mongoose.js') // to ensure mongoose.js runs so mongoose gets connected to database
const Task = require('./models/task.js')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter) // y being loaded as middleware?
app.use(taskRouter)


app.listen(port, () => {
    console.log('server is running on port' + port)
})
