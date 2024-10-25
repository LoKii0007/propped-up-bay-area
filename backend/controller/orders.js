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

    //TODO: Validate total

    const order = await openHouseSchema.create({
      userId: req.user.userId,
      type,
      firstName,
      lastName,
      email,
      phone,
      firstEventDate,
      firstEventStartTime,
      firstEventEndTime,
      firstEventAddress: {
        streetAddress: firstEventAddress.streetAddress,
        streetAddress2: firstEventAddress.streetAddress2,
        city: firstEventAddress.city,
        state: firstEventAddress.state,
        postalCode: firstEventAddress.postalCode,
      },
      requiredZone: {
        name: requiredZone.name,
        text: requiredZone.text,
        price: requiredZone.price,
        resetPrice: requiredZone.resetPrice,
      },
      pickSign,
      additionalSignQuantity,
      twilightTourSlot,
      printAddressSign,
      printAddress: {
        streetAddress: printAddress.streetAddress,
        streetAddress2: printAddress.streetAddress2,
        city: printAddress.city,
        state: printAddress.state,
        postalCode: printAddress.postalCode,
      },
      additionalInstructions,
      total,
    });

    res.status(200).json({ order, message: "Order created successfully" });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: error.message });
  }
};


//? ---------------------------
//? -------get openHouseOrderApi
//? ---------------------------
const getOpenHouseOrderApi = async (req, res)=>{
  try {
    const orders = await openHouseSchema.find({userId : req.user.userId})
    console.log('orders:',orders)
    if(!orders){
      console.log('no order found')
      return res.status(400).json({message:'no order found'})
    }
    return res.status(200).json({orders})
  } catch (error) {
    console.log('error in get openhouseapi', error.message)
    return res.status(500).json({message : 'error in get openhouseapi', error:error.message})
  }
}

//? ---------------------------
//? -------get postOrder API
//? ---------------------------
const getPostOrderApi = async (req, res)=>{
  try {
    const orders = await postOrderSchema.findById(req.user.userId)
    if(!orders){
      console.log('no order found')
      return res.status(400).json({message:'no order found'})
    }
    return res.status(200).json({orders})
  } catch (error) {
    console.log('error in get openhouseapi', error.message)
    return res.status(200).json({message : 'error in get openhouseapi', error:error.message})
  }
}

//? ---------------------------
//? -------create postOrderApi
//? ---------------------------
const createPostOrderApi = async (req, res) => {
  try {
    // Destructure form data from request body
    const {
      type,
      firstName,
      lastName,
      email,
      phone,
      neededByDate,
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

    //TODO: Validate total
    // Create a new form document with the provided data and user ID from middleware
    const newForm = new postOrderSchema({
      userId: req.user.userId,
      type,
      firstName,
      lastName,
      email,
      phone,
      neededByDate,
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
    });

    // Save the form to the database
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating form", error });
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
const upadteOrderApi = async(req, res) => {
  try {
    const {orderType, userId, orderStatus} = req.body
    // Find the user and check their status
    const user = await User.findById(req.user.userId);
    if (!user || (user.status !== 'admin' && user.status !== 'superuser')) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    if (orderType === 'openHouse') {
      
      const updatedOrder = await openHouseSchema.findByIdAndUpdate(
        userId,
        { oStatus: orderStatus },
        { new: true } 
      )

      if (!updatedOrder) {
        return res.status(404).json({ msg: 'Order not found' });
      }

      return res.status(200).json({ msg: 'Order updated successfully!', order: updatedOrder })
    }

    else if (orderType === 'postOrder') {
      
      const updatedOrder = await postOrderSchema.findByIdAndUpdate(
        userId,
        { oStatus: orderStatus },
        { new: true } 
      )

      if (!updatedOrder) {
        return res.status(404).json({ msg: 'Order not found' });
      }

      return res.status(200).json({ msg: 'Order updated successfully!', order: updatedOrder })
    }

    else if (orderType === 'postRemoval') {
      
      const updatedOrder = await postRemovalSchema.findByIdAndUpdate(
        userId,
        { oStatus: orderStatus },
        { new: true } 
      )

      if (!updatedOrder) {
        return res.status(404).json({ msg: 'Order not found' });
      }

      return res.status(200).json({ msg: 'Order updated successfully!', order: updatedOrder })
    }
    return res.status(400).json({ msg: 'Invalid order type' })
  } catch (error) {
    console.log('error in update orders api', error.message)
    return res.status(500).json({msg : 'error in update orders api'})
  }
}

module.exports = { createOpenHouseOrderApi , getOpenHouseOrderApi, getPostOrderApi , postRemovalApi , createPostOrderApi, upadteOrderApi }