//creates express app and gets it running

const express = require('express')
require('./db/mongoose.js') // to ensure mongoose.js runs so mongoose gets connected to database
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
const oauthRouter = require('./routers/oauth.js')
const app = express() //creates express app 
const port = process.env.PORT
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path');

app.use(cookieParser())
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));

app.use(express.json())
app.use(userRouter) 
app.use(taskRouter)
app.use(oauthRouter)
app.use(passport.initialize())
app.use(passport.session())


//hbs config
const viewsPath = path.join(__dirname, '/views')
app.set('views', viewsPath)
app.set('view engine', 'hbs')

app.listen(port, () => {
    console.log('server is running on port' + port)
})
