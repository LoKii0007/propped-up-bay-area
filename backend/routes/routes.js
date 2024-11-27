const express = require('express')
const { stripeSubscription, stripeCustomPayment, cancelSubscription, stipeSubscriptionWebhook } = require('../controller/paymentServer')
const {userDetails, updateUserDetails, getAllUsersApi, getUserDetailsApi, getSingleUserDetails, uploadUserImage, sendReminderEmail} = require('../controller/users')
const { signUp, login, getUserByToken, updatePassword, adminLogin, signOutApi, updateAdminDetails, authUpdate, updateAdminPassword, sendOtp, resetPassword, uploadAdminImage, deleteUser } = require('../controller/auth')
const { createOpenHouseOrderApi, createPostOrderApi, getOpenHouseOrderApi, getPostOrderApi, updateOrderApi, getAllOrdersApi, getOpenHouseInvoiceApi } = require('../controller/orders')
const {verifyUser, checkPaymentStatus} = require('../utilities/middleware')
const { openHouseImage, postOrderImage, updateOpenHouseImage, updatePostOrderImage, getOrderImage } = require('../controller/image')
const Routes = express.Router()
const multer = require('multer');
const { generateAuthUrl, addDataToMultipleSheet, getTokens } = require('../utilities/sheetautomation')
const upload = multer({ storage: multer.memoryStorage() }); 


//? -----------------------------
//? auth route
//? -----------------------------
Routes.post('/auth/sign-up', signUp) // initial signup
Routes.post('/auth/login', login) // custom login
Routes.get('/auth/login', verifyUser, getUserByToken ) // getting user by token
Routes.patch('/auth/update/password', verifyUser, updatePassword ) // updating pass
Routes.post('/auth/update/connected-accounts', verifyUser, authUpdate ) // updating pass
Routes.get('/auth/logout', verifyUser, signOutApi)  //signout
Routes.post('/auth/send-otp', sendOtp)  //send otp
Routes.post('/auth/reset-pass',verifyUser, resetPassword)  // reset pass


//? -----------------------------
//? user details routes
//? -----------------------------
Routes.post('/auth/sign-up/details',verifyUser, userDetails) //user details for complete signup
Routes.patch('/api/update/user-details',verifyUser, updateUserDetails) // updation of user details
Routes.get('/api/get/user-details',verifyUser, getUserDetailsApi) //get user details
Routes.post('/api/update/user-image',verifyUser, upload.single('file'), uploadUserImage) //update user image
Routes.post('/api/user/send-reminder',verifyUser, sendReminderEmail) // send notification for profile update


//? -----------------------------
//? orders route
//? -----------------------------
Routes.post('/api/orders/open-house-order', checkPaymentStatus ,verifyUser, createOpenHouseOrderApi) //openhouse new order
Routes.post('/api/orders/post-order',checkPaymentStatus, verifyUser, createPostOrderApi) // new postorder

Routes.get('/api/orders/open-house-order', verifyUser , getOpenHouseOrderApi) //openhouse get
Routes.get('/api/orders/post-order',verifyUser, getPostOrderApi) // postorder get

Routes.get('/api/invoice/open-house-order', getOpenHouseInvoiceApi) // openhouse invoice get


//? -----------------------------
//? admin only routes
//? -----------------------------
Routes.get('/api/orders/get-all',verifyUser, getAllOrdersApi) // get all orders
Routes.get('/api/user-details/get',verifyUser, getSingleUserDetails) // get single user detail
Routes.patch('/api/orders/change-status',verifyUser, updateOrderApi) // updation of user orders
Routes.get('/api/users/get',verifyUser, getAllUsersApi) // get all users
Routes.post('/api/user/delete',verifyUser, deleteUser) // delete user

Routes.post('/auth/admin-login', adminLogin) // custom admin login
Routes.patch('/auth/admin/password/update',verifyUser, updateAdminPassword) // update admin password
Routes.patch('/auth/admin/profile/update',verifyUser, updateAdminDetails) // admin profile update
Routes.post('/auth/admin/image/update',verifyUser, upload.single('file'), uploadAdminImage) // admin image update

//* -------------------
//* image routes
Routes.post('/api/open-house/image-upload', verifyUser, upload.single('image'), openHouseImage)  // upload openhouse image
Routes.post('/api/post-order/image-upload', verifyUser,upload.single('image'), postOrderImage)  // upload postorder image
Routes.patch('/api/open-house/image-update', verifyUser,upload.single('image'), updateOpenHouseImage)  // update openhouse
Routes.patch('/api/post-order/image-update', verifyUser,upload.single('image'), updatePostOrderImage)  // update postorder
Routes.get('/api/orders/image-get', getOrderImage)  // get image


//? -----------------------------
//? payment route
//? -----------------------------
Routes.post('/api/orders/open-house/create-checkout-session',verifyUser, stripeCustomPayment) // openHouse order payment
Routes.post('/api/orders/post-order/subscription-schedule',verifyUser, stripeSubscription)  //postorder subscription
Routes.post('/api/orders/post-order/subscription-webhook', stipeSubscriptionWebhook)  //postorder subscription webhook
Routes.post('/webhook', stipeSubscriptionWebhook)  //postorder subscription webhook
Routes.patch('/api/orders/post-order/cancel-subscription', verifyUser, cancelSubscription) // cancel stripe subscription and post removal


// google sheets admin
Routes.get('/api/sheets/auth', verifyUser, generateAuthUrl)     
Routes.get('/api/sheets/add-callback', getTokens )     

// test for sheets
Routes.post('/api/sheets', addDataToMultipleSheet)

module.exports = Routes