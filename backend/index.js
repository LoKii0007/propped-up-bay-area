const express = require('express')
const Connection = require('./db')
const cors = require('cors')
const Routes = require('./routes/routes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = 5000

//? db connnection
Connection()

//? cors configurations
app.use(cors({
    origin: ['http://localhost:5173', 'https://propped-up-bay-area.vercel.app'], 
    credentials: true,
}))

app.use(
    '/api/orders/post-order/subscription-webhook',
    bodyParser.raw({ type: "application/json" }) // Raw parsing for Stripe webhook
  );

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())

app.use('/', Routes)

app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`)
})