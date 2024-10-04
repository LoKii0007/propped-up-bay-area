import OpenHouseForm from '../models/openHouseForm';

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { zones, additionalPrices } = require('../data/staticData');


// Helper function to calculate rush fee
function calculateRushFee(eventDate) {
    const currentDate = new Date();
    const eventDateObj = new Date(eventDate);
    const currentTime = currentDate.getHours();
    
    const isToday = currentDate.toDateString() === eventDateObj.toDateString();
    const isFriday = currentDate.getDay() === 5;
    const isSaturday = currentDate.getDay() === 6;
    const isSunday = currentDate.getDay() === 0;
  
    if (isToday || (isFriday && currentTime >= 16) || (isSaturday && currentTime >= 16) || (isSunday && currentTime >= 16)) {
      return additionalPrices.RushFee;
    }
  
    return 0;
  }


const verifyTotal =  (data) => {
    const {
      requiredZone,
      pickSign,
      additionalSignQuantity,
      printAddressSign,
      twilightTourSlot,
      firstEventDate
    } = data

    // Calculate rush fee
    const rushFee = calculateRushFee(firstEventDate);

    // Calculate total
    let total = selectedZone.price + rushFee;

    return total
}

export const openHouseOrder = async (req, res) => {
    try {

        const total = verifyTotal(req.body)
        if(total !== req.body.total){
            return res.status(400).json({ error: 'chalu banega' })
        }
        const order = await OpenHouseForm.create(req.body)
        res.status(200).json({order:order, message:'order created'})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {openHouseOrder}