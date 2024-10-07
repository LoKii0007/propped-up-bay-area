const express = require('express')
const { paymentSession } = require('../controller/paymentServer')
const { signUp, login } = require('../controller/auth')
const { postRemovalApi, openHouseOrderApi, postOrderApi } = require('../controller/orders')
const Routes = express.Router()


//? -----------------------------
//? auth route
//? -----------------------------
Routes.post('/auth/signUp', signUp)
Routes.post('/auth/login', login)


//? -----------------------------
//? orders route
//? -----------------------------
Routes.post('/api/orders/openHouseOrder', openHouseOrderApi)
Routes.post('/api/orders/postOrder', postOrderApi)
Routes.post('/api/orders/postRemoval', postRemovalApi)


//? -----------------------------
//? admin only routes
//? -----------------------------


//? -----------------------------
//? payment route
//? -----------------------------
Routes.post('/create-checkout-session', paymentSession)

module.exports = Routes