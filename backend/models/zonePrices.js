const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  zonePrice: { 
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
});

const zonePricesSchema = mongoose.model("ZonePrices", schema);

module.exports = zonePricesSchema;
