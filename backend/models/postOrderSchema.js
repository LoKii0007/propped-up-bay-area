const mongoose = require("mongoose");
const { Schema } = mongoose;

const formSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  orderNo : {
    type : String,
  },
  type : {type : String, required : true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  requestedDate: { type: Date, required: true },

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
  status : {
    type:String,
    enum : ['pending', 'completed', 'installed', 'removed'],
    default : 'pending'
  },
  subActive : {
    type : Boolean,
    default : true
  },
  paid : {
    type : Boolean,
    default : false
  },
  sessionId : {
    type : String,
    // required : true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

//? indexing
formSchema.index({userId : 1, subActive : 1})

const postOrderSchema = mongoose.model("postOrderForm", formSchema);

module.exports = { postOrderSchema };
