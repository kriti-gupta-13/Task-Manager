const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async (req, res, next) => {
    try {
        const token = req.header('authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id : decoded.id, 'tokens.token' : token})

        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch(e) {
        res.status(401).send("please authenticate")
    }
}

const cookieAuth = async (req, res, next) => {
    try {
        //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjRlZDE1YWU0ZDQ5YmVjMmVmYTQ3OSIsImlhdCI6MTcwNjM1NTk4OSwiZXhwIjoxNzA2OTYwNzg5fQ.yE794ybHcdgEpYD5SWhUrz5hnxuAmiBkzmYet7dKW5U' 
        console.log(req)
        const token = req.cookies['task-manager-token']
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id : decoded.id, 'tokens.token' : token})

        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch(e) {
        console.log(e)
        res.status(401).send("please authenticate")
    }
}

module.exports = {
    auth,
    cookieAuth
}