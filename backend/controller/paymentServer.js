const { postOrderSchema } = require("../models/postOrderSchema");
const { openHouseSchema } = require("../models/openHouseSchema");
const User = require("../models/user");
const {
  nodemailerTransport,
  gmailTemplateOrder,
} = require("../utilities/gmail");
const {
  verifyOpenHouseTotal,
  verifyPostOrderTotal,
} = require("../utilities/verifyTotal");
const { completeOpenHouseOrder, completePostOrder } = require("./orders");
require("dotenv").config();
const additionalPricesSchema = require("../models/additionalPrices");
const SuperUser = require("../models/superUser");

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
      return res
        .status(400)
        .json({
          msg: "Prices may have been updated. Please refresh the page and try again.",
        });
    }

    let customer;
    const existingCustomers = await stripe.customers.list({
      email: data.email,
      limit: 1, // Limit to one result for efficiency
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]; // Use the existing customer
    } else {
      // Create a new customer if one doesn't exist
      customer = await stripe.customers.create({
        email: data.email,
        name: data.name, // Optional: include the name
      });
    }

    // Convert to cents
    const amountInCents = Math.round(data.total * 100);
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
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
//? create monthly product
//? ----------------------------------------
const createMonthlyProduct = async (req, res) => {
  try {
    const { price, id } = req.body;

    const userId = req.user.userId;
    console.log(userId);

    const user = await SuperUser.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.role !== "superUser" && user.role !== "admin") {
      return res.status(400).json({ msg: "User not authorized" });
    }

    // Input validation
    if (!price || typeof price !== "number" || price <= 0) {
      return res.status(400).json({ msg: "Invalid product name or price" });
    }

    // Create the product
    const product = await stripe.products.create({
      name: "Post Order Monthly Subscription",
    });

    // Create the price for the product
    const subscriptionPrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // Convert price to cents
      currency: "usd", // Default to USD if no currency provided
      recurring: { interval: "day" }, // Set recurring interval to monthly
      product: product.id,
    });

    const updatedProduct = await additionalPricesSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          productId: product.id,
          priceId: subscriptionPrice.id,
          price: price,
        },
      },
      { new: true }
    );

    res.status(201).json({
      msg: "Product with monthly subscription created successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error creating subscription product:", error.message);
    res
      .status(500)
      .json({
        msg: "Failed to create subscription product",
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
      return res
        .status(400)
        .json({
          msg: "Prices may have been updated. Please refresh the page and try again.",
        });
    }

    const amountInCents = data.total * 100;
    const price = await additionalPricesSchema.findOne({
      name: "subscription",
    });

    // console.log(price);

    let customer;
    const existingCustomers = await stripe.customers.list({
      email: data.email,
      limit: 1, // Limit to one result for efficiency
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]; // Use the existing customer
    } else {
      // Create a new customer if one doesn't exist
      customer = await stripe.customers.create({
        email: data.email,
        name: data.name, // Optional: include the name
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
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
          price: price.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        orderId: data._id,
      },
      subscription_data: {
        // trial_period_days: 30, // Add 30-day free trial to the subscription,
        metadata: {
          orderId: data._id, // Attach orderId to the subscription
        },
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
    console.log(sessionId, orderId);
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

  // Construct the event from the signature
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error("Webhook event construction error: ", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Helper function: sanitize and fetch order
  const getOrder = async (orderId) => {
    const sanitizedId = orderId
      .toString()
      .replace(/^["']|["']$/g, "")
      .trim();
    return await postOrderSchema.findById(sanitizedId);
  };

  // Handle the event
  try {
    switch (event.type) {
      /** Event: Checkout Session Completed */
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.mode === "payment") {
          try {
            const orderId = session.metadata.orderId;
            const result = await completeOpenHouseOrder(orderId, session);
            if (result.success) {
              return res.status(200).json({ msg: result.msg });
            } else {
              return res
                .status(400)
                .json({
                  msg:
                    result.msg || "Something went wrong in completeOpenHouse",
                });
            }
          } catch (error) {
            console.error("Error in open house webhook:", error.message);
            return res.status(500).send("Error processing open house order.");
          }
        }

        if (session.mode === "subscription") {
          const order = await getOrder(session.metadata.orderId);

          if (!order) {
            console.log("No order found:", session.metadata.orderId);
            return res.status(404).send("Order not found.");
          }

          if (!order.paid) {
            const result = await completePostOrder(order._id, session);
            if (result.success) {
              return res.status(200).json({ msg: result.msg });
            } else {
              return res
                .status(400)
                .json({
                  msg:
                    result.msg || "Something went wrong in completePostOrder",
                });
            }
          }
        }
        break;
      }

      /** Event: Invoice Payment Succeeded */
      case "invoice.payment_succeeded": {
        console.log('here1')
        const invoice = event.data.object;
        console.log('here2', invoice.metadata.orderId)
        const order = await getOrder(invoice.metadata.orderId);

        console.log("Order:", order);

        if (!order || !order.paid) {
          console.log(
            "Order already marked as paid or not found:",
            invoice.metadata.orderId
          );
          return res.status(404).send("Order not found.");
        }

        // Retrieve the customer's email details
        const stripeEmail = invoice.customer_details.email;

        // Find the user
        const user = await User.findById(order.userId);
        if (!user) {
          console.log("User not found for userId:", order.userId);
          return res.status(404).send("User not found.");
        }

        const invoiceUrl = `https://propped-up-bay-area.vercel.app/download/invoice/${order._id}`;

        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: [stripeEmail, user.email, order.email], // Send to all emails
          subject: "Propped Up Order Confirmed",
          html: gmailTemplateOrder(order.firstName, "post order", invoiceUrl),
        };

        // Send the email
        try {
          await nodemailerTransport.sendMail(mailOptions);
          return res.status(200).json({ msg: "Order processed successfully." });
        } catch (error) {
          console.error("Error sending email:", error.message);
          return res
            .status(500)
            .json({ msg: "Order processed, but email failed to send." });
        }
      }

      /** Default: Unhandled Event Type */
      default:
        console.log(`Unhandled event type: ${event.type}`);
        return res.status(200).json({ msg: "Event received." });
    }
  } catch (error) {
    console.error("Error handling webhook:", error.message);
    return res.status(500).json({ msg: "Internal Server Error." });
  }
};

module.exports = {
  stripeSubscription,
  stripeCustomPayment,
  cancelSubscription,
  stipeSubscriptionWebhook,
  createMonthlyProduct,
};
