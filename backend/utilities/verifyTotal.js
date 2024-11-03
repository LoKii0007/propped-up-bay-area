const { zones, openHouseAdditionalPrices } = require("../data/pricingData");

// Helper function to check if the event is within the same week as today
const isSameWeek = (date) => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
};

const checkRushFee = (selectedDate) => {
  const currentDate = new Date();
  const eventDate = new Date(selectedDate);

  const isToday = currentDate.toDateString() === eventDate.toDateString();
  let applyRushFee = false;

  const currentTime = currentDate.getHours() + currentDate.getMinutes() / 60;

  if (isSameWeek(eventDate)) {
    // Ordering on Friday after 4 pm for events on Friday, Saturday, Sunday
    if (currentDate.getDay() === 5 && currentTime >= 16) {
      if ([5, 6, 0].includes(eventDate.getDay())) {
        applyRushFee = true;
      }
    }

    // Ordering on Saturday after 4 pm for events on Saturday, Sunday
    if (currentDate.getDay() === 6 && currentTime >= 16) {
      if ([6, 0].includes(eventDate.getDay())) {
        applyRushFee = true;
      }
    }

    // Ordering on Sunday after 4 pm for events on the same day
    if (currentDate.getDay() === 0 && currentTime >= 16 && isToday) {
      applyRushFee = true;
    }
  }

  return applyRushFee;
};

module.exports = checkRushFee;

const verifyOpenHouseTotal = (data) => {
  // Find the zone price by name
  const selectedZone = zones.find(
    (zone) => zone.name.toLowerCase() === data.requiredZone.name.toLowerCase()
  );

  if (!selectedZone) {
    return false;
  }

  // Calculate initial total based on zone price
  let calculatedTotal = selectedZone.price;

  // sign pick up for selected zone
  if (data.pickSign) {
    calculatedTotal += selectedZone.resetPrice;
  }

  // Add costs based on additional signs if selected
  if (data.additionalSignQuantity > 0) {
    calculatedTotal +=
      data.additionalSignQuantity * openHouseAdditionalPrices.signReset;
  }

  // Include print address sign fee if selected
  if (data.printAddressSign) {
    calculatedTotal += openHouseAdditionalPrices.AddressPrint;
  }

  // Include twilight tour fee if a slot is selected
  if (data.twilightTourSlot === "slot1" || data.twilightTourSlot === "slot2") {
    calculatedTotal += openHouseAdditionalPrices.TwilightHour;
  }

  if (checkRushFee(data.orderDate)) {
    calculatedTotal += openHouseAdditionalPrices.RushFee;
  }

  // Compare calculated total to provided total
  const isTotalValid = calculatedTotal === data.total;

  return isTotalValid;
};

module.exports = verifyOpenHouseTotal;
