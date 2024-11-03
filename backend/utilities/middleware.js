const jwt = require('jsonwebtoken');
const User = require('../models/user');
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//? ------------------------------
//? Middleware to verify the JWT token
//? ------------------------------
const verifyUser = (req, res, next) => {
  const token = req.cookies.authToken

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
}

//? ----------------------------
//? check payment status
//? ----------------------------
const checkPaymentStatus = async (req, res, next) => {
  const { sessionId } = req.query;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment status is 'paid'
    if (session.payment_status === 'paid') {
      next()
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve session", error: error.message });
  }
};

module.exports = {verifyUser, checkPaymentStatus};
