const express = require('express')
const { stripePayment, stripeWebhook, stripeSubscription } = require('../controller/paymentServer')
const { signUp, login, userDetails, getUserByToken, updateUserDetails, updatePassword, getAllUsersApi, adminLogin, getUserDetailsApi, signOutApi } = require('../controller/auth')
const { postRemovalApi, createOpenHouseOrderApi, createPostOrderApi, getOpenHouseOrderApi, getPostOrderApi, updateOrderApi, getAllOrdersApi } = require('../controller/orders')
const verifyUser = require('../utilities/middleware')
const Routes = express.Router()


//? -----------------------------
//? auth route
//? -----------------------------
Routes.post('/auth/signUp', signUp) // initial signup
Routes.post('/auth/login', login) // custom login
Routes.get('/auth/login', verifyUser, getUserByToken ) // getting user by token
Routes.patch('/auth/updatePassword', verifyUser, updatePassword ) // updating pass
Routes.get('/auth/logout', verifyUser, signOutApi)  //signout


//? -----------------------------
//? user details routes
//? -----------------------------
Routes.post('/auth/signUp/details',verifyUser, userDetails) //user details for complete signup
Routes.patch('/api/update/userDetails',verifyUser, updateUserDetails) // updation of user details
Routes.get('/api/get/userDetails',verifyUser, getUserDetailsApi) //user details for complete signup


//? -----------------------------
//? orders route
//? -----------------------------
Routes.post('/api/orders/openHouseOrder', verifyUser , createOpenHouseOrderApi) //openhouse new order
Routes.post('/api/orders/postOrder',verifyUser, createPostOrderApi) // new postorder
Routes.post('/api/orders/postRemoval',verifyUser, postRemovalApi) //postremoval

Routes.get('/api/orders/openHouseOrder', verifyUser , getOpenHouseOrderApi) //openhouse get
Routes.get('/api/orders/postOrder',verifyUser, getPostOrderApi) // postorder get


//? -----------------------------
//? admin only routes
//? -----------------------------
Routes.get('/api/orders/getAll',verifyUser, getAllOrdersApi) // get all user orders
Routes.patch('/api/orders/update',verifyUser, updateOrderApi) // updation of user orders
Routes.get('/api/users',verifyUser, getAllUsersApi) // updation of user orders
Routes.post('/auth/adminLogin', adminLogin) // custom login


//? -----------------------------
//? payment route
//? -----------------------------
Routes.post('/openHouse/create-checkout-session', stripePayment)
Routes.post('/postOrder/create-checkout-session', stripeSubscription)
Routes.post('/webhook',express.raw({type: 'application/json'}), stripeWebhook)


module.exports = Routes