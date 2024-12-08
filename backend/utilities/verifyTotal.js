const zonePricesSchema = require("../models/zonePrices");
const additionalPricesSchema = require("../models/additionalPrices");

async function getOpenHouseZones() {
  const zones = await zonePricesSchema.find({ type: "openHouse" });
  return zones;
}

async function getPostOrderZones() {
  const zones = await zonePricesSchema.find({ type: "postOrder" });
  return zones;
}

async function getOpenHouseAdditionalPrices() {
  const additionalPrices = await additionalPricesSchema.findOne({ type: "openHouse" });
  return additionalPrices;
}

async function getPostOrderAdditionalPrices() {
  const additionalPrices = await additionalPricesSchema.findOne({ type: "postOrder" });
  return additionalPrices;
}

// Helper function to check if the event is within the same week as today
const isSameWeek = (date, currentDate) => {
  try {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  } catch (error) {
    console.error("server error while calculating isSameWeek");
  }
};


const checkRushFee = (selectedDate) => {
  try {
    const currentDate = new Date();
    const eventDate = new Date(selectedDate);

    const isToday = currentDate.toDateString() === eventDate.toDateString();
    let applyRushFee = false;

    const currentTime = currentDate.getHours() + currentDate.getMinutes() / 60;

    console.log("same weeek : ", isSameWeek(eventDate, currentDate));

    if (isSameWeek(eventDate, currentDate)) {
      // Ordering on Friday after 4 pm for events on Friday, Saturday, Sunday
      if (currentDate.getDay() === 5 && currentTime >= 16) {
        if ([5, 6, 0].includes(eventDate.getDay())) {
          applyRushFee = true;
        }
      }

      // Ordering on Saturday for events on Saturday, Sunday
      if (currentDate.getDay() === 6) {
        if ([6, 0].includes(eventDate.getDay())) {
          applyRushFee = true;
        }
      }

      // Ordering on Sunday for events on the same day
      if (currentDate.getDay() === 0 && isToday) {
        applyRushFee = true;
      }
    }

    return applyRushFee;
  } catch (error) {
    console.error("server error while calculating rushfee");
  }
};


const verifyOpenHouseTotal = async (data) => {
  try {
    const zones = await getOpenHouseZones();
    const openHouseAdditionalPrices = await getOpenHouseAdditionalPrices();

    const selectedZone = zones.find(
      (zone) => zone.name.toLowerCase() === data.requiredZone.name.toLowerCase()
    );

    if (!selectedZone) {
      return false;
    }

    // Calculate initial total based on zone price
    let calculatedTotal = Number(selectedZone.price);

    // Sign pick-up for selected zone
    if (data.pickSign) {
      calculatedTotal += Number(selectedZone.resetPrice);
    }

    // Add costs based on additional signs if selected
    if (data.additionalSignQuantity > 0) {
      calculatedTotal +=
        Number(data.additionalSignQuantity) *
        Number(openHouseAdditionalPrices.signReset);
    }

    // Include print address sign fee if selected
    if (data.printAddressSign) {
      calculatedTotal += Number(openHouseAdditionalPrices.AddressPrint);   //? here
    }

    // Include twilight tour fee if a slot is selected
    if (
      data.twilightTourSlot === "slot1" ||
      data.twilightTourSlot === "slot2"
    ) {
      calculatedTotal += Number(openHouseAdditionalPrices.TwilightHour);
    }

    // Check and apply rush fee if applicable
    if (checkRushFee(data.requestedDate)) {
      calculatedTotal += Number(openHouseAdditionalPrices.RushFee);
    }

    const isTotalValid = calculatedTotal === Number(data.total);

    return isTotalValid;
  } catch (error) {
    console.error("server error while verifying openHouse total");
  }
};


const verifyPostOrderTotal = async (data) => {
  try {
    const zones = await getPostOrderZones();
    const postOrderAdditionalPrices = await getPostOrderAdditionalPrices();

    // Find the zone price by name
    const selectedZone = zones.find(
      (zone) => zone.name.toLowerCase() === data.requiredZone.name.toLowerCase()
    );

    if (!selectedZone) {
      return false;
    }

    // Calculate initial total based on zone price
    let calculatedTotal = 0;

    // Add the cost of posts based on the number of posts selected
    if (data.numberOfPosts > 0) {
      calculatedTotal +=
        Number(data.numberOfPosts) * Number(selectedZone.price);
    }

    // Add the cost of flyer box if selected
    if (data.flyerBox) {
      calculatedTotal += Number(postOrderAdditionalPrices.flyerBox);
    }

    // Add the cost of lighting if selected
    if (data.lighting) {
      calculatedTotal += Number(postOrderAdditionalPrices.lighting);
    }

    // Add the cost for each type of rider
    if (data.riders) {
      const riderKeys = Object.keys(data.riders);
      riderKeys.forEach((riderType) => {
        calculatedTotal +=
          Number(data.riders[riderType]) * Number(postOrderAdditionalPrices.rider);
      });
    }

    // Compare the calculated total with the provided total
    const isTotalValid = calculatedTotal === Number(data.total);

    console.log(isTotalValid);
    return isTotalValid;
  } catch (error) {
    console.error("server error while verifying post order total", error);
  }
};


module.exports ={ verifyOpenHouseTotal, verifyPostOrderTotal};
