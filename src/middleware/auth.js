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
        const token = req.cookies['task-manager-token']
        if (!token) {
            return res.redirect('/login')
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id : decoded.id})

        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch(e) {
        console.log(e)
        return res.redirect('/login')
    }
}

module.exports = {
    auth,
    cookieAuth
}