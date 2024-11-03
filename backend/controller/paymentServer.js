
const { postOrderSchema } = require("../models/postOrderSchema");

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const frontendUrl = "http://localhost:5173";
const frontendUrl = "https://propped-up-bay-area.vercel.app";

//? ----------------------------
//? stripe one time payment for openHouse
//? ----------------------------
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
      mode: "payment",
      success_url: `${frontendUrl}/order/openHouse/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/order/openHouse/payment?canceled=true`,
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Failed to create checkout session",
        error: error.message,
      });
  }
};

//? ----------------------------
//? stripe subscription
//? ----------------------------
const stripeSubscription = async (req, res) => {
  try {

    const {firstName,lastName, email, total } = req.body

    // adding customer to stripe
    const customer = await stripe.customers.create({
      name : `${firstName} ${lastName}`,
      email,
    });

    if (!customer) {
      res.status(200).json({ msg: "error creating customer" });
    }

    const amountInCents = total * 100;

    // creating subscription
    const schedule = await stripe.subscriptionSchedules.create({
      start_date: "now",
      end_behavior: "release",
      customer: customer.id,
      phases: [
        {
          iterations: 1,
          items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: amountInCents, // Amount in cents
                product: "prod_QzXUu3mBk2v5hE",
                recurring: {
                  interval: "month",
                },
              },
              quantity: 1,
            },
          ],
        },
        {
          items: [
            {
              price : 'price_1Q7YPsSGNvyNL8D3bbSlSt6Q',
              quantity : 1
            },
          ],
          // iterations: 12,
        },
      ],
    });

    res.status(200).json({ schedule });
  } catch (error) {
    console.log("error in subscription payment method: ", error.message);
    res.status(500).json({ msg: "error in subscription API", err: error });
  }
};


//? ----------------------------
//? cancel stripe subscription
//? ----------------------------
const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId, orderId } = req.body;

    const order = await postOrderSchema.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Cancel the subscription immediately
    const deletedSubscription = await stripe.subscriptionSchedules.cancel(subscriptionId);
    
    if (deletedSubscription) {
      order.subActive = false; // Set subActive to false
      await order.save(); // Save the updated order
    }

    res.status(200).json({ msg: "Subscription canceled successfully", subscription: deletedSubscription });
  } catch (error) {
    console.log("Error in subscription cancellation: ", error.message);
    res.status(500).json({ msg: "Error in subscription cancellation", err: error });
  }
};


const addStripeCustomer = async (req, res) => {
  const { name, email } = req.body;

  const customer = await stripe.customers.create({
    name,
    email,
  });

  if (!customer) {
    res.status(200).json({ msg: "error creating customer" });
  }
  res.status(200).json({msg: "customer created ", customer});

};

module.exports = {
  stripeSubscription,
  stripeCustomPayment,
  cancelSubscription,
};
