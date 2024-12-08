const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//? ------------------------------
//? Middleware to verify the JWT token
//? ------------------------------
const verifyUser = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ msg: "Access denied. Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is expired
    if (decoded.exp * 1000 < Date.now()) { // `exp` is in seconds; convert to ms
      return res.status(401).json({ msg: "Token expired. Please log in again." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(400).json({ msg: "Invalid token." });
  }
};


//? ----------------------------
//? middleware to check payment status
//? ----------------------------
const checkPaymentStatus = async (req, res) => {
  const { sessionId } = req.query;
  console.log('sessionId : ', sessionId )
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment status is 'paid'
    if (session && session.payment_status === "paid") {
      return res.status(200).json({ success: true, msg: "Payment completed" });
    } else {
      return res.status(400).json({ success: false, msg: "Payment not completed" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Failed to retrieve session", error: error.message });
  }
};

module.exports = { verifyUser, checkPaymentStatus };
