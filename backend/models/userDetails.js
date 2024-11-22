const mongoose = require("mongoose");
const { CALIFORNIA_CITIES } = require("../data/pricingData");

const signUpDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  caDreLicense: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
    enum: CALIFORNIA_CITIES,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  workPhone: {
    type: String,
    required: true,
  },
  mobilePhone: {
    type: String,
    required: true,
  },
  receiveEmailNotifications: {
    type: Boolean,
    default: false,
  },
  receiveTextNotifications: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserDetails = mongoose.model("userDetails", signUpDetailsSchema);

module.exports = UserDetails;
