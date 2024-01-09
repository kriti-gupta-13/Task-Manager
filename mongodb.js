const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017/TaskManager'
//const databaseName = 'TaskManager'

const client = new MongoClient(connectionURL);


client.connect(connectionURL, (error, client) => {
    if (error) {
        return console.log("Unable to connect")
    }
    console.log('Connected successfully')
})

