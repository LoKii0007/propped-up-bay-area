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
    origin: ['http://localhost:5173', 'https://propped-up-bay-area.vercel.app', 'https://propped-up-bay-area-1.onrender.com', 'https://propped-up-bay-area.vercel.app/login' ], 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}))
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())

app.use('/', Routes)

app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`)
})