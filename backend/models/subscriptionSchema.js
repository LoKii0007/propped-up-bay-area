const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  isSubscribed: { type: Boolean, default: false },
  subscriptionDate: { type: Date },
  expirationDate: { type: Date },
  paymentId: { type: String },
});

const Subscription  = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription
