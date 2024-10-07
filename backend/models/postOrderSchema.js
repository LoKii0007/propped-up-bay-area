const mongoose = require("mongoose");
const { Schema } = mongoose;

const formSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  neededByDate: { type: Date, required: true },

  listingAddress: {
    streetAddress: { type: String, required: true },
    streetAddress2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },

  billingAddress: {
    streetAddress: { type: String, required: true },
    streetAddress2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },

  requiredZone: {
    name: { type: String, required: true },
    text: { type: String },
    price: { type: Number, required: true, default: 0 },
  },

  additionalInstructions: { type: String },
  total: { type: Number, default: 0 },
  postColor: { type: String },
  flyerBox: { type: Boolean, default: false },
  lighting: { type: Boolean, default: false },
  numberOfPosts: { type: Number, default: 0 },

  riders: {
    comingSoon: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    openSatSun: { type: Number, default: 0 },
    openSat: { type: Number, default: 0 },
    openSun: { type: Number, default: 0 },
    doNotDisturb: { type: Number, default: 0 },
  },
});

const postOrderSchema = mongoose.model("postOrderForm", formSchema);

module.exports = { postOrderSchema };
