const express = require('express')
const { paymentSession } = require('../controller/paymentServer')
const Routes = express.Router()


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