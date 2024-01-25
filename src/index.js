//creates express app and gets it running

const express = require('express')
require('./db/mongoose.js') // to ensure mongoose.js runs so mongoose gets connected to database
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
const oauthRouter = require('./routers/oauth.js')
const app = express() //creates express app 
const port = process.env.PORT
const passport = require('passport')
const session = require('express-session');



app.use(session({ secret: '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', resave: true, saveUninitialized: true }));

app.use(express.json())
app.use(userRouter) 
app.use(taskRouter)
app.use(oauthRouter)
app.use(passport.initialize());
app.use(passport.session());


app.listen(port, () => {
    console.log('server is running on port' + port)
})
