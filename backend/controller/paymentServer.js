require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const frontendUrl = "http://localhost:5173";

//? ----------------------------
//? stripe one time payment
//? ----------------------------
const stripePayment = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "{{PRICE_ID}}",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${frontendUrl}?success=true`,
    cancel_url: `${frontendUrl}?canceled=true`,
  });
  res.redirect(303, session.url);
};

//? ----------------------------
//? stripe subscription
//? ----------------------------
const stripeSubscription = async (req, res) => {
  const productId = process.env.POST_ORDER_SUBSCRIPTION_PRODUCT_ID
  const priceId1 = process.env.POST_ORDER_SUBSCRIPTION_FIRST_MONTH_PRICE_ID
  const priceId2 = process.env.POST_ORDER_SUBSCRIPTION_UPCOMING_MONTH_PRICE_ID

  try {
    // const session = await stripe.checkout.sessions.create({
    //   mode: "subscription",
    //   line_items: [
    //     {
    //       price: priceId,
    //       quantity: 1,
    //     },
    //   ],
      
    //   success_url:frontendUrl,
    //   cancel_url: frontendUrl,
    // })

    const schedule = await stripe.subscriptionSchedules.create({
      // customer: 'cus_GBHHxuvBvO26Ea',
      start_date: "now",
      end_behavior: "release",
      phases: [
        {
          items: [{ price: priceId1 , quantity: 1 }],
          iterations: 1, // Charge $15 for only the first month
        },
        {
          items: [{ price: priceId2, quantity: 1 }],
          iterations: null, // Charge $50 until the subscription is canceled
        },
      ],
    })

    // console.log('session : ', session)
    res.status(200).json({ url: session.url , subSchedule : schedule })
  } catch (error) {
    console.log('error in subscription payment method : ', error.message)
    res.status(500).json({msg:'error in subscription api', err : error})
  }
}


//? ----------------------------
//? stripe subscription webhook
//? ----------------------------
const subscriptionWebhook = async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret = "{{STRIPE_WEBHOOK_SECRET}}";
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
    case "checkout.session.completed":
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      break;
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      break;
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break;
    default:
    // Unhandled event type
  }

  res.sendStatus(200);
};

// 3) Run the server on http://localhost:4242
//   node server.js

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_e662210b0cef7d6463eb71696d0672373be74b79ec4b7012dee27b6813d4e931";

const stripeWebhook = (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  console.log(`Unhandled event type ${event.type}`);

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
      const customerSubscriptionCreated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      console.log('subscription purchased')
      break;
    case "customer.subscription.deleted":
      const customerSubscriptionDeleted = event.data.object;
      // Then define and call a function to handle the event customer.subscription.deleted
      console.log('subscription cancelled')
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

module.exports = {
  stripePayment,
  stripeSubscription,
  stripeWebhook,
  subscriptionWebhook,
};
