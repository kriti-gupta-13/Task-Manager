const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth.js')
//const oauth = require('../middleware/oauth.js')
const User = require('../models/user')
const emails = require('../emails/accounts') 


router.post('/users', async (req, res) => {
    const user = new User(req.body)


    try {
        await user.save()
        emails.sendWelcomeMail(user.mail,user.name) // async but dont need to wait therefore no await 
        const token = await user.generateAuthToken()

        console.log(user)
        res.status(201).send({user, token}) // will go into res.body
    }

    catch(e){
        res.status(400).send(e) //y hardcode 400, y not 500? could be other error too; y we had to specify ; y 200 was coming when clearly it was an error   
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.mail, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((element) => element.token != req.token)
        await req.user.save()
        res.send() // what the use of this?

    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send() 

    } catch(e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) => {
    

    // to communicate error when non-existent fields r updated
    const allowedUpdates = ["name", "mail", "password","age"]
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate) {
        return res.status(404).send("Invalid updates")
    }

    try {
        //const user = await User.findById(_id)

        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        // findByIdAndUpdate bypasses middleware therefore not using it
        //const updatedUser = await User.findByIdAndUpdate(_id, req.body, {new : true, runValidators: true}) //how would we know it does not check validation, the docs r so poorly written
        
        res.send(req.user)

    }
    catch(e) {
        res.status(400).send(e) // did not mentioned 500 or server issues
    }
})


router.delete('/users/me', auth, async (req, res) => {
    
    try {
        await req.user.deleteOne()
        emails.sendDeleteMail(req.user.mail,req.user.name)
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e) 
    }

})

module.exports = router