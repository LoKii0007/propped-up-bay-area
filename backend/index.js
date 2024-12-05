const express = require('express')
const Connection = require('./db')
const cors = require('cors')
const Routes = require('./routes/routes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { stipeSubscriptionWebhook } = require('./controller/paymentServer')

const app = express()
const PORT = 5000

//? db connnection
Connection()

//? cors configurations
app.use(cors({
    origin: ['http://localhost:5173', 'https://propped-up-bay-area.vercel.app'], 
    credentials: true,
}))

app.use(express.static('public'))

app.post('/api/orders/webhook', bodyParser.raw({ type: "application/json" }), stipeSubscriptionWebhook) 
app.use(express.json())
app.use(cookieParser())
// app.use(bodyParser.json())

app.use('/', Routes)

app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`)
})