const express = require('express')
const { stripePayment, stripeWebhook, stripeSubscription } = require('../controller/paymentServer')
const { signUp, login } = require('../controller/auth')
const { postRemovalApi, openHouseOrderApi, postOrderApi } = require('../controller/orders')
const verifyUser = require('../utilities/middleware')
const Routes = express.Router()


//? -----------------------------
//? auth route
//? -----------------------------
Routes.post('/auth/signUp', signUp)
Routes.post('/auth/login', login)


//? -----------------------------
//? orders route
//? -----------------------------
Routes.post('/api/orders/openHouseOrder', verifyUser , openHouseOrderApi)
Routes.post('/api/orders/postOrder',verifyUser, postOrderApi)
Routes.post('/api/orders/postRemoval',verifyUser, postRemovalApi)


//? -----------------------------
//? admin only routes
//? -----------------------------


//? -----------------------------
//? payment route
//? -----------------------------
Routes.post('/openHouse/create-checkout-session', stripePayment)
Routes.post('/postOrder/create-checkout-session', stripeSubscription)
Routes.post('/webhook',express.raw({type: 'application/json'}), stripeWebhook)


module.exports = Routes