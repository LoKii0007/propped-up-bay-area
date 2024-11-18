const { postOrderSchema } = require("../models/postOrderSchema");
const User = require("../models/user");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const frontendUrl = process.env.FRONTEND_URL;
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

//? ----------------------------------------
//? stripe one time payment for openHouse
//? ----------------------------------------
const stripeCustomPayment = async (req, res) => {
  const { total } = req.body;

  // Validate the total to ensure it is a number and greater than zero
  if (typeof total !== "number" || total <= 0) {
    return res.status(400).json({ message: "Invalid custom amount" });
  }

  // Convert to cents
  const amountInCents = Math.round(total * 100);

  try {
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
      invoice_creation : {
        enabled : true
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
  const { total } = req.body;
  const amountInCents = total * 100;

  try {
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
          price: "price_1QH5BiSBgjrcPEt3WZQKnEZH",
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 30, // Add 30-day free trial to the subscription
      },
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
    console.error("Error in canceling subscription: ", error);
    res.status(500).json({ msg: "Failed to cancel subscription", error });
  }
};


//? ----------------------------------------
//? stripe subscription webhook
//? ----------------------------------------
const stipeSubscriptionWebhook = async (req, res) => {
  const sig = request.headers["stripe-signature"];
  console.log('sig : ', sig)
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log('Webhook Error: ',err.message)
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // const checkoutSessionCompleted = event.data.object;
      // const session = await stripe.checkout.sessions.retrieve(
      //   checkoutSessionCompleted
      // );
      // const customerDetails = session.customer_details;
      // console.log("monthly payment completed :", customerDetails?.email);
      console.log("webhook hit :");

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ msg: "order placed" });
};


module.exports = {
  stripeSubscription,
  stripeCustomPayment,
  cancelSubscription,
  stipeSubscriptionWebhook,
};
