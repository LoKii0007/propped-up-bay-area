const { postOrderSchema } = require("../models/postOrderSchema");
const User = require("../models/user");
const { nodemailerTransport, gmailTemplate } = require("../utilities/gmail");
const {verifyOpenHouseTotal, verifyPostOrderTotal} = require("../utilities/verifyTotal");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const frontendUrl = process.env.FRONTEND_URL;
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

//? ----------------------------------------
//? stripe one time payment for openHouse
//? ----------------------------------------
const stripeCustomPayment = async (req, res) => {
  try {
    const { data } = req.body;

    // Validate the total to ensure it is a number and greater than zero
    if (typeof data.total !== "number" || data.total <= 0) {
      return res.status(400).json({ message: "Invalid custom amount" });
    }

    // if (!verifyOpenHouseTotal(data)) {
    //   return res.status(400).json({ msg: "Price mismatch. Please try again" });
    // }

    // Convert to cents
    const amountInCents = Math.round(data.total * 100);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd", // Change to your currency
            product_data: {
              name: "open house order", // Optional: provide a product name
            },
            unit_amount: amountInCents, // Use the custom amount
          },
          quantity: 1,
        },
      ],
      invoice_creation: {
        enabled: true,
      },
      metadata: {
        orderId: JSON.stringify(data._id),
      },
      mode: "payment",
      success_url: `${frontendUrl}/order/openHouse/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/order/openHouse/payment?canceled=true`,
    });

    if (!session) {
      res.status(400).json({
        msg: "Failed to create checkout session",
        error: error.message,
      });
    }

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Failed to create checkout session",
      error: error.message,
    });
  }
};

//? ----------------------------------------
//? stripe subscription
//? ----------------------------------------
const stripeSubscription = async (req, res) => {
  try {
    const { data } = req.body;

    if (typeof data.total !== "number" || data.total <= 0) {
      return res.status(400).json({ message: "Invalid custom amount" });
    }

    // if (!verifyPostOrderTotal(data)) {
    //   return res.status(400).json({ msg: "Price mismatch. Please try again" });
    // }

    const amountInCents = data.total * 100;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd", // Change to your currency
            product_data: {
              name: "Post order first month fee", // Optional: provide a product name
            },
            unit_amount: amountInCents, // Use the custom amount
          },
          quantity: 1,
        },
        {
          // price: "price_1QH5BiSBgjrcPEt3WZQKnEZH",
          price: "price_1QMSxESBgjrcPEt399r9hu9F",
          quantity: 1,
        },
      ],
      // subscription_data: {
      //   trial_period_days: 30, // Add 30-day free trial to the subscription
      // },
      mode: "subscription",
      success_url: `${frontendUrl}/order/postOrder/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/order/postOrder/payment?canceled=true`,
    });

    if (!session) {
      res.status(400).json({
        msg: "Failed to create checkout session",
        error: error.message,
      });
    }
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.log("error in subscription payment method: ", error.message);
    res.status(500).json({ msg: "error in subscription API", err: error });
  }
};

//? ----------------------------------------
//? cancel stripe subscription
//? ----------------------------------------
const cancelSubscription = async (req, res) => {
  const { sessionId, orderId } = req.body;
  const userId = req.user.userId;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription
      );

      if (subscription.status === "canceled") {
        return res
          .status(400)
          .json({ msg: "Subscription is already canceled." });
      }

      const canceledSubscription = await stripe.subscriptions.cancel(
        subscription.id
      );

      if (!canceledSubscription) {
        return res.status(400).json({ msg: "Error from Stripe" });
      }

      const orderUpdated = await postOrderSchema.findByIdAndUpdate(
        orderId,
        { subActive: false },
        { new: true }
      );

      if (!orderUpdated) {
        return res.status(400).json({ msg: "Error updating order details" });
      }

      const activeSubscriptionExists = await postOrderSchema.exists({
        userId: userId,
        subActive: true,
      });

      if (!activeSubscriptionExists) {
        await User.findByIdAndUpdate(userId, { isSubscribed: false });
      }

      res.status(200).json({
        msg: "Subscription canceled successfully",
      });
    } else {
      res.status(400).json({ msg: "No subscription found for this session" });
    }
  } catch (error) {
    console.error("Error in canceling subscription: ", error.message);
    res.status(500).json({ msg: "Failed to cancel subscription", error });
  }
};

//? ----------------------------------------
//? stripe subscription webhook
//? ----------------------------------------
const stipeSubscriptionWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  console.log('sig', sig)
  console.log('endpointSecret', endpointSecret)
  console.log('req.body', req.body)
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log("Webhook Error: ", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const sessionId = session.id;

      console.log('session metadata', JSON.parse(session.metadata))

      const orderId = JSON.parse(session.metadata.orderId);

      const order = await openHouseSchema.findByIdAndUpdate(orderId, { paid: true }, { new: true });

      if (!order) {
        return res.status(404).json({ msg: "Order not found" });
      }

      console.log('order updated successfully', order)

      if (session.subscription) {
        try {
          // Find the post-order form associated with the sessionId
          const order = await postOrderSchema.findOne({ sessionId });

          if (!order) {
            console.log("No order found for session ID:", sessionId);
            return res.status(404).send("Order not found.");
          }

          // Retrieve the user's email (from Stripe)
          const customerDetails = checkoutSessionCompleted.customer_details;
          const stripeEmail = customerDetails.email;

          // Find the user in the database by userId from the order
          const user = await User.findById(order.userId);
          if (!user) {
            console.log("User not found for userId:", order.userId);
            return res.status(404).send("User not found.");
          }

          // Send the invoice email to both the user email and Stripe email
          const invoiceUrl = req.stripe?.invoiceUrl || false;
          const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: [stripeEmail, user.email, order.email], // Send to all emails
            subject: "Propped Up Order Confirmed",
            html: gmailTemplate(
              "Your order is placed successfully",
              invoiceUrl
            ),
          };

          // Increment the user's total orders and spent amount
          await User.findByIdAndUpdate(order.userId, {
            $inc: { totalOrders: 1, totalSpent: order.total },
          });

          // Send the email
          try {
            await nodemailerTransport.sendMail(mailOptions);
            console.log("Invoice email sent successfully.");
          } catch (error) {
            console.error("Error sending email:", error.message);
          }

          res.status(200).json({ msg: "Order processed successfully." });
        } catch (error) {
          console.error(
            "Error handling checkout session completed:",
            error.message
          );
          res.status(500).send("Internal Server Error");
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
      res.status(200).json({ msg: "Event received" });
  }
};

module.exports = {
  stripeSubscription,
  stripeCustomPayment,
  cancelSubscription,
  stipeSubscriptionWebhook,
};
