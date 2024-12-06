const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  price: { 
    type: Number, 
    required: true 
  },
  resetPrice: { 
    type: Number, 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  type: {
    type: String,
    required: true,
    enum: ["openHouse", "postOrder"],
  },
});

const zonePricesSchema = mongoose.model("ZonePrices", schema);

module.exports = zonePricesSchema;
