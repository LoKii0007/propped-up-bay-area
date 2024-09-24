const mongoose = require("mongoose")
require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL
console.log( 'url', MONGO_URL)

const Connection = async ()=>{
    try {
        await mongoose.connect(MONGO_URL)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log('error connecting to mongodb : ', error)
    }
}

module.exports = Connection