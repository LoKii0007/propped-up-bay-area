const express = require('express')
const { Connection } = require('mongoose')
const cors = require('cors')
const Routes = require('./routes/routes')

const app = express()
const PORT = 5000

// Connection()
app.use(cors())
app.use('/', Routes)
app.use(express.static('public'));

app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`)
})