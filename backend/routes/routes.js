const express = require('express')
const { paymentSession } = require('../controller/paymentServer')
const { signUp, login } = require('../controller/auth')
const Routes = express.Router()


// -----------------------------
// auth route
// -----------------------------
Routes.post('/auth/signUp', signUp)
Routes.post('/auth/login', login)


// -----------------------------
// orders route
// -----------------------------


// -----------------------------
// payment route
// -----------------------------


// -----------------------------
// payment route
// -----------------------------
Routes.post('/create-checkout-session', paymentSession)

module.exports = Routes