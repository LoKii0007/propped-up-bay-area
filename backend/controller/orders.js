const { zones } = require("../data/data");
const { openHouseSchema } = require("../models/openHouseSchema");
const { postRemovalSchema } = require("../models/postRemovalSchema");
const { postOrderSchema } = require("../models/postOrderSchema");




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
//? ------- openHouseOrderApi
//? ---------------------------
const openHouseOrderApi = async (req, res) => {
  try {
    // const total = verifyTotal(req.body);
    // if (total !== req.body.total) {
    //   return res.status(400).json({ error: "chalu banega" });
    // }
    const order = await openHouseSchema.create(req.body);
    res.status(200).json({ order: order, message: "order created" })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//? ---------------------------
//? -------postOrderApi
//? ---------------------------
const postOrderApi = async (req, res) =>{
  try {
    console.log('removal : ', req.body)
    const order = await postOrderSchema.create(req.body)
    res.status(200).json({ order: order, message: "order created" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


//? ---------------------------
//? -------postRemovalApi
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


module.exports = { openHouseOrderApi  , postRemovalApi , postOrderApi}