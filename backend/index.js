const express = require('express')
const Connection = require('./db')
const cors = require('cors')
const Routes = require('./routes/routes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = 5000

Connection()
app.use(cors({
    origin: ['http://localhost:5173', 'https://propped-up-bay-area.vercel.app'], 
    credentials: true,
}))


// Handle preflight requests for CORS
app.options('*', cors({
    origin: ['http://localhost:5173', 'https://propped-up-bay-area.vercel.app'],
    credentials: true
}));

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())

app.use('/', Routes)

app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`)
})