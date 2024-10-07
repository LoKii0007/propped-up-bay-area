const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId ,
    required: true,
    ref: 'Users'
  },
  isSubscribed: { type: Boolean, default: false },
  subscriptionDate: { type: Date },
  expirationDate: { type: Date },
  paymentId: { type: String },
})

const Subscription  = mongoose.model("Subscriptions", subscriptionSchema);

module.exports = {Subscription}
