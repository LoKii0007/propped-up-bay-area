const mongoose = require("mongoose");

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

const SignUpDetails = mongoose.model("SignUpDetails", signUpDetailsSchema);

module.exports = SignUpDetails;
