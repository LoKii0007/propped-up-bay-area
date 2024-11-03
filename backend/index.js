const express = require('express')
const Connection = require('./db')
const cors = require('cors')
const Routes = require('./routes/routes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')

const app = express()
const PORT = 5000

//? db connnection
Connection()

//? cors configurations
app.use(cors({
    origin: ['http://localhost:5173', 'https://propped-up-bay-area.vercel.app'], 
    credentials: true,
}))

//? compression
// app.use(compression())

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())

app.use('/', Routes)

app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`)
})