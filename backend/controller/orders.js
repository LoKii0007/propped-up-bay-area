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
const { formatDate } = require("../utilities/helper");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


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

    // if(!firstName || !lastName || !email || !phone || !requestedDate || !firstEventStartTime || !firstEventEndTime || !firstEventAddress || !requiredZone || !total || !type){
    //   return res.status(400).json({ msg: "Missing required fields" });
    // }

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

    return res.status(200).json({ order, msg: "Order placed successfully" });
  } catch (error) {
    console.error("Order creation error:", error.message);
    res.status(500).json({ msg: "Error placing order", error: error.message });
  }
};

//? -------complete openHouseOrderApi
//? ---------------------------------
const completeOpenHouseOrder = async (orderId, session) => {
  try {

    const sanitizedId = orderId.toString().replace(/^["']|["']$/g, '').trim()
    const order = await openHouseSchema.findById(sanitizedId);

    if (!order) {
      console.log("Order not found");
      return { msg: "Order not found", success: false }
    }

    // update paid
    await order.updateOne({ paid: true });
    // console.log('update 1')

    const counter = await orderCounterSchema.findOne();

    // Format the order number (e.g., OH0001, OH0002, ...)
    const orderNo = `OH${String(counter.count).padStart(5, "0")}`;

    // update orderNo
    await order.updateOne({ orderNo });
    // console.log('update 2')

    // Increment the count for the next order
    await orderCounterSchema.findOneAndUpdate({}, { $inc: { count: 1 } });

    // adding data to google sheets
    googleSheetdata = [
      order.firstName,
      order.lastName,
      order.email,
      order.phone,
      String(formatDate(String(order.requestedDate))),
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

      order?.requiredZone?.name || "",
      order?.pickSign || "",
      order?.additionalSignQuantity || "",
      order?.twilightTourSlot || "",
      order?.printAddressSign?.streetAddress || "",
      order?.additionalInstructions || "",
      order.total,
    ];

    try {
      // console.log('googlesheets : ',googleSheetdata)

      await addToGoogleSheet({
        data: googleSheetdata,
        targetSheet: "openHouseOrders",
      });
    } catch (error) {
      console.log("Open house order google sheet api error : ", error.message);
    }

    // Increment totalOrders by 1 and totalSpent by total using $inc
    await User.findByIdAndUpdate(order.userId, {
      $inc: { totalOrders: 1, totalSpent: order.total },
    });
    // console.log('update 3')

    //getting invoice url
    const invoices = await stripe.invoices.list({
      customer: session.customer,
      limit: 1, // Retrieve only the latest invoice
    });

    let invoiceUrl = `https://propped-up-bay-area.vercel.app/download/invoice/${order._id}`;
    // if (invoices.data.length > 0 && invoices.data[0].hosted_invoice_url) {
    //   invoiceUrl = invoices.data[0].hosted_invoice_url;
    // } else {
    //   invoiceUrl = `https://propped-up-bay-area.vercel.app/download/invoice/${order._id}`;
    // }

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
      console.log("order updated and email sent successfully");
      return { msg: "Order updated and email sent successfully", success: true }
    } catch (error) {
      console.error("order updated but email could not be sent", error.message);
      return { msg: "Order updated but email could not be sent", success: false }
    }
  } catch (error) {
    console.error("Error in completeOpenHouseOrder", error.message);
    return { msg: "Error in completeOpenHouseOrder", success: false }
  }
};


//? -------updateOpenHouseOrder-----
//? ---------------------------
const updateOpenHouseOrder = async (req, res) => {
  try {

    const {orderId} = req.params;
    if(!orderId){
      return res.status(400).json({ msg: "Missing orderId" });
    }

    const updateItems = {...req.body, createdAt: new Date()}
    const order = await openHouseSchema.findByIdAndUpdate(orderId, updateItems, { new: true });
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    return res.status(200).json({ order, msg: "Order updated successfully" });

  } catch (error) {
    console.error("Error in updateOpenHouseOrder", error.message);
    return res.status(500).json({ msg: "Error in updateOpenHouseOrder", error: error.message });
  }
}

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
      subscriptionFee
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

    const newForm = new postOrderSchema({
      userId,
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
      subscriptionFee
    });

    const savedForm = await newForm.save();

    res
      .status(200)
      .json({ order: savedForm, msg: "Order placed successfully" });  
  } catch (error) {
    console.error("Error creating post order:", error.message);
    res
      .status(500)
      .json({ msg: "Error creating post order", error: error.message });
  }
};

//? ------------------------------------------
//? -------- completePostOrder -------------
//? ------------------------------------------
const completePostOrder = async (orderId, session) => {
  try {
    
    const sanitizedId = orderId.toString().replace(/^["']|["']$/g, '').trim()
    const order = await postOrderSchema.findById(sanitizedId);
    if (!order) {
      console.log("Order not found");
      return { msg: "Order not found", success: false }
    }   

    // update paid
    await order.updateOne({ paid: true }, {new : true});
    await order.updateOne({ sessionId: session.id }), {new : true};

    const counter = await orderCounterSchema.findOne();

    // Format the order number (e.g., OH0001, OH0002, ...)
    const orderNo = `PO${String(counter.count).padStart(5, "0")}`;

    // update orderNo
    await order.updateOne({ orderNo });

    // Increment the count for the next order
    await orderCounterSchema.findOneAndUpdate({}, { $inc: { count: 1 } }, {new : true});

    // Increment totalOrders by 1 and totalSpent by total using $inc
    const updatedUser = await User.findByIdAndUpdate(order.userId, {
      $inc: { totalOrders: 1, totalSpent: order.total },
      isSubscribed: true
    }, {new : true});

    // adding data to google sheets
    const listingAddressBlock = [
      order.listingAddress.streetAddress,
      order.listingAddress.streetAddress2 || "",
      order.listingAddress.city,
      order.listingAddress.state,
      order.listingAddress.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    const billingAddressBlock = [
      order.billingAddress.streetAddress,
      order.billingAddress.streetAddress2 || "",
      order.billingAddress.city,
      order.billingAddress.state,
      order.billingAddress.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    const googleSheetdata = [
      order.type,
      order.firstName,
      order.lastName,
      order.email,
      order.phone,
      String(formatDate(String(order.requestedDate))),
      listingAddressBlock, // Single string for listing address
      billingAddressBlock, // Single string for billing address
      order?.requiredZone.name,
      order?.requiredZone.text || "",
      order?.requiredZone.price,
      order?.additionalInstructions || "",
      order.total,
      order.postColor || "",
      order?.flyerBox || "",
      order?.lighting || "",
      order?.numberOfPosts || "",
      order?.riders.comingSoon || "",
      order?.riders.pending || "",
      order?.riders.openSatSun || "",
      order?.riders.openSat || "",
      order?.riders.openSun || "",
      order?.riders.doNotDisturb || "",
    ];

    try {
      const sheetRes = await addToGoogleSheet({
        data: googleSheetdata,
        targetSheet: "postHouseOrders",
      });
    } catch (error) {
      console.log("Post house order google sheet api error : ", error.message);
    }

    //getting invoice url
    const invoices = await stripe.invoices.list({
      customer: session.customer,
      limit: 1, // Retrieve only the latest invoice
    });

    let invoiceUrl = `https://propped-up-bay-area.vercel.app/download/invoice/${order._id}`;
    // if (invoices.data.length > 0 && invoices.data[0].hosted_invoice_url) {
    //   invoiceUrl = invoices.data[0].hosted_invoice_url;
    // } else {
    //   invoiceUrl = `https://propped-up-bay-area.vercel.app/download/invoice/${order._id}`;
    // }

    // const user = await User.findById(order.userId);

    // Send email with Nodemailer
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: [order.email, updatedUser.email],
      subject: "Propped up order confirmed",
      html: gmailTemplateOrder(order.firstName, "post order", invoiceUrl),
    };

    try {
      await nodemailerTransport.sendMail(mailOptions);
      console.log("order updated and email sent successfully");
      return { msg: "Order updated and email sent successfully", success: true }
    } catch (error) {
      console.error("order updated but email could not be sent", error.message);
      return { msg: "Order updated but email could not be sent", success: false }
    }
  } catch (error) {
    console.error("Error in completePostOrder", error.message);
    return { msg: "Error in completePostOrder", success: false }
  }
};

//? ------------------------------------------
//? -------- updatePostOrder -------------
//? ------------------------------------------
const updatePostOrder = async (req, res) => {
  try {
    const {orderId} = req.params;

    if(!orderId){
      return res.status(400).json({ msg: "Missing orderId" });
    }

    const updateItems = {...req.body, createdAt: new Date()}
    const order = await postOrderSchema.findByIdAndUpdate(orderId, updateItems, { new: true });
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    return res.status(200).json({ order, msg: "Order updated successfully" });
  } catch (error) {
    console.error("Error in updatePostOrder", error.message);
    return res.status(500).json({ msg: "Error in updatePostOrder", error: error.message });
  }
} 

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

    const orders = await openHouseSchema.find({ userId, paid: true });
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

    const orders = await postOrderSchema.find({ userId, paid: true });
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
      return res.status(400).json({ msg: "Order ID is required" }); // 400 for Bad Request
    }

    // Query for both orders concurrently
    const [openHouseOrder, postOrder] = await Promise.all([
      openHouseSchema.findById(orderId),
      postOrderSchema.findById(orderId),
    ]);

    if (openHouseOrder) {
      return res.status(200).json({ invoice: openHouseOrder });
    } else if (postOrder) {
      return res.status(200).json({ invoice: postOrder });
    }

    // If no order is found
    console.log(`No order found for ID: ${orderId}`);
    return res.status(404).json({ msg: "No order found" });

  } catch (error) {
    console.error("Error in getOpenHouseInvoiceApi:", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};



//? ---------------------------
//? -------getDraftOrdersApi-----
//? ---------------------------
const getDraftOrdersApi = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let openHouseCount = 0;
    let postOrderCount = 0;
    if (page === 1) {
      openHouseCount = await openHouseSchema.countDocuments({ userId, paid: false });
      postOrderCount = await postOrderSchema.countDocuments({ userId, paid: false });
    }
    let orders = [];

    const openHouseOrders = await openHouseSchema.find({ userId, paid: false }).skip(skip).limit(limit);
    const postOrders = await postOrderSchema.find({ userId, paid: false }).skip(skip).limit(limit);

    orders.push(...openHouseOrders, ...postOrders);

    return res.status(200).json({ orders, msg: "Orders found", openHouseCount, postOrderCount });
  } catch (error) {
    console.log("Error in getDraftOrdersApi", error.message);
    return res.status(500).json({ msg: "Error in getDraftOrdersApi", error: error.message });
  }
};


//? ---------------------------
//? -------deleteDraftOrderApi-----
//? ---------------------------
const deleteDraftOrderApi = async (req, res) => {
  try {
    const { orderId, type } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    if (!orderId || !type) {
      return res.status(400).json({ msg: "Missing required fields: orderId or type" });
    }

    let schema;
    if (type === "openHouse") {
      schema = openHouseSchema;
    } else if (type === "postOrder") {
      schema = postOrderSchema;
    } else {
      return res.status(400).json({ msg: "Invalid type specified" });
    }

    // Find and verify ownership before deletion
    const document = await schema.findOne({ _id: orderId, userId });
    if (!document) {
      return res.status(404).json({ msg: "Order not found or not authorized to delete" });
    }

    await schema.findByIdAndDelete(orderId);
    return res.status(200).json({ msg: "Order deleted successfully" });

  } catch (error) {
    console.error("Error in deleteDraftOrderApi:", error.message);
    return res.status(500).json({ msg: "Error in deleteDraftOrderApi", error: error.message });
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
        res.status(200).json({msg: "Order updated successfully!" });
      } catch (error) {
        console.error("Email sending error:", error.message);
        res.status(200).json({
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
        res.status(200).json({msg: "Order updated successfully!" });
      } catch (error) {
        console.error("Email sending error:", error.message);
        res.status(200).json({
          msg: "Order updated successfully, but email could not be sent",
        });
      }

      // return res.status(200).json({ msg: "Order updated successfully!" });
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
  try {
    const user = await SuperUser.findById(req.user.userId);
    if (!user || !['superuser', 'admin'].includes(user.role)) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get total counts once per session if needed
    const totalOpenHouseCount = await openHouseSchema.countDocuments({ paid: true });
    const totalPostCount = await postOrderSchema.countDocuments({ paid: true });
    const totalOrderCount = totalOpenHouseCount + totalPostCount;
    
    // Fetch limited orders from both collections
    const [openHouseOrders, postOrders] = await Promise.all([
      openHouseSchema.find({ paid: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      postOrderSchema.find({ paid: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    const combinedOrders = [...openHouseOrders, ...postOrders]
      .sort((a, b) => b.createdAt - a.createdAt);

    if (combinedOrders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({
      orders: combinedOrders,
      message: "Orders found.",
      count: totalOrderCount,
    });
  } catch (error) {
    console.log("Error in getAllOrdersApi", error.message);
    return res.status(500).json({
      message: "Error in getAllOrdersApi",
      error: error.message,
    });
  }
};


const getPostOrdersAdminApi = async (req, res) => {
  try {
    const user = await SuperUser.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: "unauthorized" });
    }

    if (user.role !== "superuser" && user.role !== "admin") {
      return res.status(401).json({ message: "unauthorized" });
    }

    const page = parseInt(req.query.page) || 1; // Get page number
    const limit = parseInt(req.query.limit) || 20; // Get limit
    const skip = (page - 1) * limit; // How many orders to skip

    // Calculate total order count (for the first page)
    let totalOrderCount = 0;
    if (page === 1) {
      totalOrderCount = await postOrderSchema.countDocuments({ paid: true });
    }

    let postOrders = await postOrderSchema.find({ paid: true }).skip(skip).limit(limit);
    // console.log("postOrders", postOrders);
  

    if (postOrders.length === 0) {
      console.log("No orders found");
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({
      orders : postOrders,
      message: "Orders found.",
      count: totalOrderCount,
    });
  } catch (error) {
    console.log("Error in getPostOrdersAdminApi", error.message);
    return res.status(500).json({
      message: "Error in getPostOrdersAdminApi",
      error: error.message,
    });
  }
}


module.exports = {
  createOpenHouseOrderApi,
  getOpenHouseOrderApi,
  getPostOrderApi,
  createPostOrderApi,
  updateOrderApi,
  getAllOrdersApi,
  getOpenHouseInvoiceApi,
  completeOpenHouseOrder,
  completePostOrder,
  getDraftOrdersApi,
  getPostOrdersAdminApi,
  deleteDraftOrderApi,
  updateOpenHouseOrder,
  updatePostOrder,
};
