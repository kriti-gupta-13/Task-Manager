const express = require('express')
const router = new express.Router()
const User = require('../models/user')



router.post('/users', async (req, res) => {
    const user = new User(req.body)


    try{
        await user.save()
        console.log(user)
        res.status(201).send(user) // will go into res.body
    }

    catch(e){
        res.status(400).send(e) //y hardcode 400, y not 500? could be other error too; y we had to specify ; y 200 was coming when clearly it was an error   
    }
})

router.get('/users', async (req, res) => {

    try{
    const users = await User.find({})
    res.send(users)
    }

    catch(e) {
        res.status(500).send(e) 
    }
})

router.get('/users/:id', async (req, res) => {   // : before dynamic values
    const _id = req.params.id // mongoose automatically converts string id to objct id

    try{
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    }

    catch(e) {
        if(e.name === 'CastError'){
            return res.status(400).send('Invalid id')
        }
        res.status(500).send(e) 
    }
})

router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id

    // to communicate error when non-existent fields r updated
    const allowedUpdates = ["name", "mail", "password","age"]
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate) {
        return res.status(404).send("Invalid updates")
    }

    try{
        const user = await User.findById(_id)

        if (!user){
            return res.status(404).send('no user with the id exist')
        }

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        // findByIdAndUpdate bypasses middleware therefore not using it
        //const updatedUser = await User.findByIdAndUpdate(_id, req.body, {new : true, runValidators: true}) //how would we know it does not check validation, the docs r so poorly written
        
        res.send(user)

    }
    catch(e) {
        res.status(400).send(e) // did not mentioned 500 or server issues
    }
})

router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    
    try{
        const user = await User.findByIdAndDelete(_id)
        if(!user) {
            return res.status(404).send('no user with the id exist')
        }
        res.send()
    }
    catch(e) {
        res.status(500).send(e) // sends 500 when invalid id !!!
    }

})

module.exports = router