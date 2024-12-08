const { postOrderSchema } = require("../models/postOrderSchema");
const { openHouseSchema } = require("../models/openHouseSchema");
const User = require("../models/user");
const {
  nodemailerTransport,
  gmailTemplate,
  gmailTemplateOrder,
} = require("../utilities/gmail");
const {
  verifyOpenHouseTotal,
  verifyPostOrderTotal,
} = require("../utilities/verifyTotal");
const { completeOpenHouseOrder, completePostOrder } = require("./orders");
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

    if (!verifyOpenHouseTotal(data)) {
      return res.status(400).json({ msg: "Prices may have been updated. Please refresh the page and try again." });
    }

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

    if (!verifyPostOrderTotal(data)) {
      return res.status(400).json({ msg: "Prices may have been updated. Please refresh the page and try again." });
    }

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
          price: "price_1QMSxESBgjrcPEt399r9hu9F",
          quantity: 1,
        },
      ],
      metadata: {
        orderId: data._id,
      },
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

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body.toString("utf8"),
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error("Webhook event construction error: ", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      if (session.mode === "payment") {
        try {
          const orderId = session.metadata.orderId;
          if (completeOpenHouseOrder(orderId , session)) {
            res.status(200).json({ msg: "Order processed successfully." });
          } else {
            res.status(400).json({ msg: "Order not found." });
          }
        } catch (error) {
          console.error("error in open house webhook", error.message);
        }
      }

      if (session.mode === "subscription") {
        try {

          const sanitizedId = session.metadata.orderId.toString().replace(/^["']|["']$/g, '').trim()
          const order = await postOrderSchema.findById(sanitizedId);

          if (!order) {
            console.log("No order found ", sanitizedId);
            return res.status(404).send("Order not found.");
          }

          if (order.paid === false) {
            completePostOrder(order._id, session);
            return res.status(200).json({ msg: "Order processed successfully." });
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

          const invoices = await stripe.invoices.list({
            customer: session.customer,
            limit: 1, // Retrieve only the latest invoice
          });

          let invoiceUrl;
          if (invoices.data.length > 0 && invoices.data[0].hosted_invoice_url) {
            invoiceUrl = invoices.data[0].hosted_invoice_url;
          } else {
            invoiceUrl = `https://propped-up-bay-area.vercel.app/download/invoice/${order._id}`;
          }

          const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: [stripeEmail, user.email, order.email], // Send to all emails
            subject: "Propped Up Order Confirmed",
            html: gmailTemplateOrder(order.firstName, "post order", invoiceUrl),
          };

          // Increment the user's total orders and spent amount
          // await User.findByIdAndUpdate(order.userId, {
          //   $inc: { totalOrders: 1, totalSpent: order.total },
          // });

          // Send the email
          try {
            await nodemailerTransport.sendMail(mailOptions);
            return res.status(200).json({ msg: "Order processed successfully." });
          } catch (error) {
            console.error("Error sending email:", error.message);
            return res.status(500).json({ msg: "Error sending email" });
          }
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
