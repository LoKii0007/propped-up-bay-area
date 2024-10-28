const { zones } = require("../data/data");
const { openHouseSchema } = require("../models/openHouseSchema");
const { postRemovalSchema } = require("../models/postRemovalSchema");
const { postOrderSchema } = require("../models/postOrderSchema");
const User = require("../models/user");


// Helper function to calculate rush fee
function calculateRushFee(eventDate) {
  const currentDate = new Date();
  const eventDateObj = new Date(eventDate);
  const currentTime = currentDate.getHours();

  const isToday = currentDate.toDateString() === eventDateObj.toDateString();
  const isFriday = currentDate.getDay() === 5;
  const isSaturday = currentDate.getDay() === 6;
  const isSunday = currentDate.getDay() === 0;

  if (
    isToday ||
    (isFriday && currentTime >= 16) ||
    (isSaturday && currentTime >= 16) ||
    (isSunday && currentTime >= 16)
  ) {
    return additionalPrices.RushFee;
  }

  return 0;
}

const verifyTotal = (data) => {
  const {
    requiredZone,
    pickSign,
    additionalSignQuantity,
    printAddressSign,
    twilightTourSlot,
    firstEventDate,
  } = data;

  // Calculate rush fee
  const rushFee = calculateRushFee(firstEventDate);

  // Calculate total
  let total = selectedZone.price + rushFee;

  return total;
};

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
      firstEventDate,
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
      total
    } = req.body;

    // Validate total
    if (!total || typeof total !== "number" || total <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await openHouseSchema.create({
      userId,
      type,
      firstName,
      lastName,
      email,
      phone,
      firstEventDate,
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

    // Increment totalOrders by 1 and totalSpent by total using $inc
    await User.findByIdAndUpdate(userId, {
      $inc: { totalOrders: 1, totalSpent: total }
    });

    res.status(200).json({ order, message: "Order created successfully" });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Error creating order" });
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

    // Validate total
    if (!total || typeof total !== "number" || total <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    });

    const savedForm = await newForm.save();

    // Increment totalOrders by 1 and totalSpent by total using $inc
    await User.findByIdAndUpdate(userId, {
      $inc: { totalOrders: 1, totalSpent: total }
    });

    res.status(201).json({ savedForm, message: "Post order created successfully" });
  } catch (error) {
    console.error("Error creating post order:", error);
    res.status(500).json({ message: "Error creating post order", error: error.message });
  }
};


//? ---------------------------
//? -------get openHouseOrderApi
//? ---------------------------
const getOpenHouseOrderApi = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await openHouseSchema.find({ userId });
    if (!orders.length) { // Check if orders array is empty
      console.log('No order found');
      return res.status(404).json({ message: 'No order found' });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.log('Error in getOpenHouseOrderApi', error.message);
    return res.status(500).json({ message: 'Error in getOpenHouseOrderApi', error: error.message });
  }
};

//? ---------------------------
//? -------getPostOrderApi-----
//? ---------------------------
const getPostOrderApi = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await postOrderSchema.find({ userId });
    if (!orders.length) { // Check if orders array is empty
      console.log('No order found');
      return res.status(404).json({ message: 'No order found' });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.log('Error in getPostOrderApi', error.message);
    return res.status(500).json({ message: 'Error in getPostOrderApi', error: error.message });
  }
};


//? ---------------------------
//? -------create postRemovalApi
//? ---------------------------
const postRemovalApi = async (req, res) =>{
  try {
    console.log('removal : ', req.body)
    const order = await postRemovalSchema.create(req.body)
    res.status(200).json({ order: order, message: "order created" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


//? ---------------------------
//? -------update Orders Api
//? ---------------------------
const updateOrderApi = async(req, res) => {
  try {
    const {orderId , orderStatus, orderType} = req.body
    // Find the user and check their status
    const user = await User.findById(req.user.userId);
    if (!user || (user.status !== 'admin' && user.status !== 'superuser')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (orderType === 'openHouse') {
      
      const updatedOrder = await openHouseSchema.findByIdAndUpdate(
        orderId,
        { status: orderStatus },
        { new: true } 
      )

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json({ message: 'Order updated successfully!', order: updatedOrder })
    }else if (orderType === 'postOrder') {
      
      const updatedOrder = await postOrderSchema.findByIdAndUpdate(
        orderId,
        { status: orderStatus },
        { new: true } 
      )

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json({ message: 'Order updated successfully!', order: updatedOrder })
    }

    else if (orderType === 'postRemoval') {
      
      const updatedOrder = await postRemovalSchema.findByIdAndUpdate(
        orderId,
        { status: orderStatus },
        { new: true } 
      )

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json({ message: 'Order updated successfully!', order: updatedOrder })
    }
    return res.status(400).json({ message: 'Invalid order type' })
  } catch (error) {
    console.log('error in update orders api', error.message)
    return res.status(500).json({message : 'error in update orders api'})
  }
}


//? ---------------------------
//? -------get all Orders API
//? ---------------------------
const getAllOrdersApi = async (req, res) => {
  let orders = [];
  try {
    const user = await User.findById(req.user.userId)
    if(!user){
      return res.status(401).json({ message: 'unauthorized' });
    }

    if(user.role !== 'superuser' && user.role !== 'admin' ){
      return res.status(401).json({ message: 'unauthorized' });
    }

    const page = parseInt(req.query.page) || 1; // Get page number from query, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get limit from query, default to 10
    const skip = (page - 1) * limit; // Calculate how many orders to skip

    const openHouseOrders = await openHouseSchema.find().skip(skip).limit(limit);
    const postOrders = await postOrderSchema.find().skip(skip).limit(limit);
    
    orders.push(...openHouseOrders, ...postOrders);

    if (orders.length === 0) {
      console.log('No orders found');
      return res.status(404).json({ message: 'No orders found' });
    }

    return res.status(200).json({ orders, message:'orders found .' });
  } catch (error) {
    console.log('Error in getAllOrdersApi', error.message);
    return res.status(500).json({ message: 'Error in getAllOrdersApi', error: error.message });
  }
};

module.exports = { createOpenHouseOrderApi , getOpenHouseOrderApi, getPostOrderApi , postRemovalApi , createPostOrderApi, updateOrderApi, getAllOrdersApi }