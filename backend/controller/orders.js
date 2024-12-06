const { openHouseSchema } = require("../models/openHouseSchema");
const { postOrderSchema } = require("../models/postOrderSchema");
const User = require("../models/user");
const SuperUser = require("../models/superUser");
const {
  gmailTemplateOrder,
  nodemailerTransport,
  gmailTemplateOrderStatus,
  gmailTemplateOrderStatusUpdate,
} = require("../utilities/gmail");
const { addToGoogleSheet } = require("../utilities/sheetautomation");
const orderCounterSchema = require("../models/orderCounterSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//? ---------------------------
//? -------create openHouseOrderApi
//? ---------------------------
const createOpenHouseOrderApi = async (req, res) => {
  try {
    const {
      type,
      firstName,
      lastName,
      email,
      phone,
      requestedDate,
      firstEventStartTime,
      firstEventEndTime,
      firstEventAddress,
      requiredZone,
      pickSign,
      additionalSignQuantity,
      twilightTourSlot,
      printAddressSign,
      printAddress,
      additionalInstructions,
      total,
    } = req.body;

    //TODO Validate total
    if (!total || typeof total !== "number" || total <= 0) {
      return res.status(400).json({ msg: "Invalid total amount" });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const order = await openHouseSchema.create({
      userId,
      type,
      firstName,
      lastName,
      email,
      phone,
      requestedDate,
      firstEventStartTime,
      firstEventEndTime,
      firstEventAddress: {
        streetAddress: firstEventAddress?.streetAddress,
        streetAddress2: firstEventAddress?.streetAddress2,
        city: firstEventAddress?.city,
        state: firstEventAddress?.state,
        postalCode: firstEventAddress?.postalCode,
      },
      requiredZone: {
        name: requiredZone?.name,
        text: requiredZone?.text,
        price: requiredZone?.price,
        resetPrice: requiredZone?.resetPrice,
      },
      pickSign,
      additionalSignQuantity,
      twilightTourSlot,
      printAddressSign,
      printAddress: {
        streetAddress: printAddress?.streetAddress,
        streetAddress2: printAddress?.streetAddress2,
        city: printAddress?.city,
        state: printAddress?.state,
        postalCode: printAddress?.postalCode,
      },
      additionalInstructions,
      total,
    });

    return res.status(201).json({ order, msg: "Order placed successfully" });
  } catch (error) {
    console.error("Order creation error:", error.message);
    res.status(500).json({ msg: "Error placing order", error: error.message });
  }
};

//? -------complete openHouseOrderApi
//? ---------------------------------
const completeOpenHouseOrder = async (orderId, session) => {
  try {
    console.log("orderId", orderId);
    const order = await openHouseSchema.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // update paid
    await order.updateOne({ paid: true });

    const counter = await orderCounterSchema.findOne();

    // Format the order number (e.g., OH0001, OH0002, ...)
    const orderNo = `OH${String(counter.count).padStart(5, "0")}`;

    // update orderNo
    await order.updateOne({ orderNo });

    // Increment the count for the next order
    await orderCounterSchema.findOneAndUpdate({}, { $inc: { count: 1 } });

    // adding data to google sheets
    googleSheetdata = [
      order.firstName,
      order.lastName,
      order.email,
      order.phone,
      order.requestedDate,
      order.firstEventStartTime,
      order.firstEventEndTime,
      [
        order.firstEventAddress?.streetAddress,
        order.firstEventAddress?.city,
        order.firstEventAddress?.state,
        order.firstEventAddress?.postalCode,
      ]
        .filter(Boolean)
        .join(", "), // Combined firstEventAddress as a single block

      [
        order.printAddress?.streetAddress,
        order.printAddress?.city,
        order.printAddress?.state,
        order.printAddress?.postalCode,
      ]
        .filter(Boolean)
        .join(", "), // Combined printAddress as a single block

      order.requiredZone?.name,
      order.pickSign,
      order.additionalSignQuantity,
      order.twilightTourSlot,
      order.printAddressSign,
      order.additionalInstructions,
      order.total,
    ];

    try {
      addToGoogleSheet({
        data: googleSheetdata,
        targetSheet: "openHouseOrders",
      });
    } catch (error) {
      console.log("Open house order google sheet api error : ", error.message);
    }

    // Increment totalOrders by 1 and totalSpent by total using $inc
    await User.findByIdAndUpdate(order.userId, {
      $inc: { totalOrders: 1, totalSpent: total },
    });

    //getting invoice url
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

    const userEmail = await User.findById(order.userId);

    // Send email with Nodemailer
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: [order.email, userEmail.email],
      subject: "Propped up order confirmed",
      html: gmailTemplateOrder(order.firstName, "open house", invoiceUrl),
    };

    try {
      await nodemailerTransport.sendMail(mailOptions);
      res.status(201).json({ order, msg: "Order placed successfully" });
    } catch (error) {
      console.error("Email sending error:", error.message);
      res.status(201).json({
        order,
        msg: "Order placed successfully, but email could not be sent",
      });
    }
  } catch (error) {
    console.error("Error in completeOpenHouseOrder", error.message);
  }
};

//? ------------------------------------------
//? -------- createPostOrderApi -------------
//? ------------------------------------------
const createPostOrderApi = async (req, res) => {
  try {
    const {
      type,
      firstName,
      lastName,
      email,
      phone,
      requestedDate,
      listingAddress,
      billingAddress,
      requiredZone,
      additionalInstructions,
      total,
      postColor,
      flyerBox,
      lighting,
      numberOfPosts,
      riders,
    } = req.body;

    if (!total || typeof total !== "number" || total <= 0) {
      return res.status(400).json({ msg: "Invalid total amount" });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const counter = await orderCounterSchema.findOne();

    // Format the order number
    const orderNo = `PO${String(counter.count).padStart(5, "0")}`;

    // Increment the count for the next order
    await orderCounterSchema.findOneAndUpdate({}, { $inc: { count: 1 } });

    const newForm = new postOrderSchema({
      userId,
      orderNo,
      type,
      firstName,
      lastName,
      email,
      phone,
      requestedDate,
      listingAddress: {
        streetAddress: listingAddress?.streetAddress,
        streetAddress2: listingAddress?.streetAddress2,
        city: listingAddress?.city,
        state: listingAddress?.state,
        postalCode: listingAddress?.postalCode,
      },
      billingAddress: {
        streetAddress: billingAddress?.streetAddress,
        streetAddress2: billingAddress?.streetAddress2,
        city: billingAddress?.city,
        state: billingAddress?.state,
        postalCode: billingAddress?.postalCode,
      },
      requiredZone: {
        name: requiredZone?.name,
        text: requiredZone?.text,
        price: requiredZone?.price,
        resetPrice: requiredZone?.resetPrice,
      },
      additionalInstructions,
      total,
      postColor,
      flyerBox,
      lighting,
      numberOfPosts,
      riders,
      sessionId: req.stripe.sessionId,
    });

    const savedForm = await newForm.save();

    // adding data to google sheets
    const listingAddressBlock = [
      listingAddress.streetAddress,
      listingAddress.streetAddress2 || "",
      listingAddress.city,
      listingAddress.state,
      listingAddress.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    const billingAddressBlock = [
      billingAddress.streetAddress,
      billingAddress.streetAddress2 || "",
      billingAddress.city,
      billingAddress.state,
      billingAddress.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    const googleSheetdata = [
      type,
      firstName,
      lastName,
      email,
      phone,
      requestedDate,
      listingAddressBlock, // Single string for listing address
      billingAddressBlock, // Single string for billing address
      requiredZone.name,
      requiredZone.text || "",
      requiredZone.price,
      additionalInstructions || "",
      total,
      postColor || "",
      flyerBox,
      lighting,
      numberOfPosts,
      riders.comingSoon,
      riders.pending,
      riders.openSatSun,
      riders.openSat,
      riders.openSun,
      riders.doNotDisturb,
    ];

    try {
      // addToSheet(googleSheetdata);
      addToGoogleSheet({
        data: googleSheetdata,
        targetSheet: "postHouseOrders",
      });
    } catch (error) {
      console.log("Post order google sheet api error : ", error.message);
    }

    // Increment totalOrders by 1 and totalSpent by total using $inc
    await User.findByIdAndUpdate(userId, {
      $inc: { totalOrders: 1, totalSpent: total },
    });

    await User.findByIdAndUpdate(userId, {
      isSubscribed: true,
    });

    // Send email with Nodemailer
    const invoiceUrl = req.stripe?.invoiceUrl || false;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: [email, user.email],
      subject: "Propped up order confirmed",
      html: gmailTemplate("Your order is placed successfully", invoiceUrl),
    };

    try {
      await nodemailerTransport.sendMail(mailOptions);
      res
        .status(201)
        .json({ order: savedForm, msg: "Order placed successfully" });
    } catch (error) {
      console.error("Email sending error:", error.message);
      res.status(201).json({
        order,
        msg: "Order placed successfully, but email could not be sent",
      });
    }
  } catch (error) {
    console.error("Error creating post order:", error);
    res
      .status(500)
      .json({ msg: "Error creating post order", error: error.message });
  }
};

//? ---------------------------
//? -------get openHouseOrderApi
//? ---------------------------
const getOpenHouseOrderApi = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: "User not found" });
    }

    const orders = await openHouseSchema.find({ userId });
    if (!orders.length) {
      // Check if orders array is empty
      console.log("No order found");
      return res.status(404).json({ msg: "No order found" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.log("Error in getOpenHouseOrderApi", error.message);
    return res
      .status(500)
      .json({ msg: "Error in getOpenHouseOrderApi", error: error.message });
  }
};

//? ---------------------------
//? -------getPostOrderApi-----
//? ---------------------------
const getPostOrderApi = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: "User not found" });
    }

    const orders = await postOrderSchema.find({ userId });
    if (!orders.length) {
      // Check if orders array is empty
      console.log("No order found");
      return res.status(404).json({ msg: "No order found" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.log("Error in getPostOrderApi", error.message);
    return res
      .status(500)
      .json({ msg: "Error in getPostOrderApi", error: error.message });
  }
};

//? ---------------------------
//? -------get openhouse invoice
//? ---------------------------
const getOpenHouseInvoiceApi = async (req, res) => {
  try {
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(404).json({ msg: "No order found" });
    }

    const order = await openHouseSchema.findById(orderId);
    if (!order) {
      console.log("No order found");
      return res.status(404).json({ msg: "No order found" });
    }

    return res.status(200).json({ invoice: order });
  } catch (error) {
    console.log("Error in getOpenHouseInvoiceApi", error.message);
    return res
      .status(500)
      .json({ msg: "Error in getOpenHouseInvoiceApi", error: error.message });
  }
};

//*--------------------------------
//*----------admin api

//? ---------------------------
//? -------update Orders Api
//? ---------------------------
const updateOrderApi = async (req, res) => {
  try {
    const { orderId, status, orderType } = req.body;
    // Find the user and check their status
    const user = await SuperUser.findById(req.user.userId);
    if (!user || (user.role !== "admin" && user.role !== "superuser")) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    if (orderType === "openHouse") {
      const updatedOrder = await openHouseSchema.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ msg: "Order not found" });
      }

      // Send email with Nodemailer
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: [updatedOrder.email],
        subject: "Propped up order status updated",
        html: gmailTemplateOrderStatus(updatedOrder.firstName, status),
      };

      const mailOptionsAdmin = {
        from: process.env.SENDER_EMAIL,
        to: ['lokeshyadav@gmail.com'],
        subject: "Propped up order status updated",
        html: gmailTemplateOrderStatusUpdate(),
      };

      try {
        await nodemailerTransport.sendMail(mailOptions);
        await nodemailerTransport.sendMail(mailOptionsAdmin);
        res.status(201).json({msg: "Order updated successfully!" });
      } catch (error) {
        console.error("Email sending error:", error.message);
        res.status(201).json({
          msg: "Order updated successfully, but email could not be sent",
        });
      }

      // return res.status(200).json({ msg: "Order updated successfully!" });
    } else if (orderType === "postOrder") {
      const updatedOrder = await postOrderSchema.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ msg: "Order not found" });
      }

      // Send email with Nodemailer
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: [updatedOrder.email],
        subject: "Propped up order status updated",
        html: gmailTemplateOrderStatus(updatedOrder.firstName, status),
      };

      const mailOptionsAdmin = {
        from: process.env.SENDER_EMAIL,
        to: ['lokeshyadav@gmail.com'],
        subject: "Propped up order status updated",
        html: gmailTemplateOrderStatusUpdate(),
      };

      try {
        await nodemailerTransport.sendMail(mailOptions);
        await nodemailerTransport.sendMail(mailOptionsAdmin);
        res.status(201).json({msg: "Order updated successfully!" });
      } catch (error) {
        console.error("Email sending error:", error.message);
        res.status(201).json({
          msg: "Order updated successfully, but email could not be sent",
        });
      }

      return res.status(200).json({ msg: "Order updated successfully!" });
    }

    // return res.status(400).json({ msg: "Invalid order type" });
  } catch (error) {
    console.log("error in update orders api", error.message);
    return res.status(500).json({ msg: "error in update orders api" });
  }
};

//? ---------------------------
//? -------get all Orders API
//? ---------------------------
const getAllOrdersApi = async (req, res) => {
  let orders = [];
  try {
    const user = await SuperUser.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: "unauthorized" });
    }

    if (user.role !== "superuser" && user.role !== "admin") {
      return res.status(401).json({ message: "unauthorized" });
    }

    const page = parseInt(req.query.page) || 1; // Get page number
    const limit = parseInt(req.query.limit) || 20; // get limit
    const skip = (page - 1) * limit; //  how many orders to skip

    // Find total users
    let totalOrderCount = 0;
    if (page === 1) {
      totalOrderCount = await openHouseSchema.countDocuments();
      totalOrderCount += await postOrderSchema.countDocuments();
    }

    const openHouseOrders = await openHouseSchema
      .find()
      .skip(skip)
      .limit(limit);

    const postOrders = await postOrderSchema.find().skip(skip).limit(limit);

    orders.push(...openHouseOrders, ...postOrders);

    if (orders.length === 0) {
      console.log("No orders found");
      return res.status(404).json({ message: "No orders found" });
    }

    return res
      .status(200)
      .json({ orders, message: "orders found .", count: totalOrderCount });
  } catch (error) {
    console.log("Error in getAllOrdersApi", error.message);
    return res
      .status(500)
      .json({ message: "Error in getAllOrdersApi", error: error.message });
  }
};

module.exports = {
  createOpenHouseOrderApi,
  getOpenHouseOrderApi,
  getPostOrderApi,
  createPostOrderApi,
  updateOrderApi,
  getAllOrdersApi,
  getOpenHouseInvoiceApi,
  completeOpenHouseOrder,
};
