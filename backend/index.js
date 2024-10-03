const express = require('express')
const Connection = require('./db')
const cors = require('cors')
const Routes = require('./routes/routes')
const bodyParser = require('body-parser')

const app = express()
const PORT = 5000

Connection()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(express.json())

app.use('/', Routes)

app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`)
})