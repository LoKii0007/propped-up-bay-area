const express = require('express')
const { stripePayment, stripeWebhook, stripeSubscription } = require('../controller/paymentServer')
const { signUp, login, userDetails } = require('../controller/auth')
const { postRemovalApi, createOpenHouseOrderApi, createPostOrderApi, getOpenHouseOrderApi } = require('../controller/orders')
const verifyUser = require('../utilities/middleware')
const Routes = express.Router()


//? -----------------------------
//? auth route
//? -----------------------------
Routes.post('/auth/signUp', signUp) // initial signup
Routes.post('/auth/signUp/details',verifyUser, userDetails) //user details for complete signup
Routes.post('/auth/login', login) //login


//? -----------------------------
//? orders route
//? -----------------------------
Routes.post('/api/orders/openHouseOrder', verifyUser , createOpenHouseOrderApi) //openhouse new order
Routes.post('/api/orders/postOrder',verifyUser, createPostOrderApi) // new postorder
Routes.post('/api/orders/postRemoval',verifyUser, postRemovalApi) //postremoval

Routes.get('/api/orders/openHouseOrder', verifyUser , getOpenHouseOrderApi) //openhouse get



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