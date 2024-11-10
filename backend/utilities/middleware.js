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
const checkPaymentStatus = async (req, res, next) => {
  const { sessionId } = req.query;
  console.log('sessionId : ', sessionId )
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment status is 'paid'
    if (session && session.payment_status === "paid") {
      // Ensure the session has a valid customer ID
      console.log('session : ',session.customer)
      if (session.customer) {
        // Retrieve the list of invoices for this customer
        const invoices = await stripe.invoices.list({
          customer: session.customer,
          limit: 1, // Retrieve only the latest invoice
        });
        console.log('invoices : ', invoices.data.length)
        // Ensure there's at least one invoice and it has a hosted URL
        if (invoices.data.length > 0 && invoices.data[0].hosted_invoice_url) {
          const invoiceUrl = invoices.data[0].hosted_invoice_url;

          // Add sessionId and invoiceUrl to the request object
          req.stripe = {
            sessionId,
            invoiceUrl
          };
        }
      } else {
        // Handle case where no customer ID is found
        req.stripe = {
          sessionId,
          invoiceUrl : false
        };
      }

      next();
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "Payment not completed" });
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ msg: "Failed to retrieve session", error: error.message });
  }
};

module.exports = { verifyUser, checkPaymentStatus };
