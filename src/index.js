const express = require('express')
require('./db/mongoose.js') // to ensure mongoose.js runs so mongoose gets connected to database
const User = require('./models/user.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        console.log(user)
        res.send(user)

    }).catch((e) => {
        console.log(e)
        res.send(e)
    })
})

app.listen(port, () => {
    console.log('server is running on port' + port)
})
