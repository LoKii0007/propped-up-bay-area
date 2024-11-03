const mongoose = require("mongoose")
const { Schema } = mongoose;

const formDataSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId ,
    required: true,
    ref: 'Users'
  },
  type : {type : String, required : true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  requestedDate: { type: Date, required: true },
  firstEventStartTime: { type: String, required: true },
  firstEventEndTime: { type: String, required: true },

  firstEventAddress: {
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
    resetPrice: { type: Number, default: 0 },
  },

  pickSign: { type: Boolean, default: false },
  additionalSignQuantity: { type: Number, default: 0 },

  twilightTourSlot: { type: String },

  printAddressSign: { type: Boolean, default: false },

  printAddress: {
    streetAddress: { type: String },
    streetAddress2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
  },

  additionalInstructions: { type: String },

  total: { type: Number, default: 0 },
  status : {
    type:String,
    enum : ['pending', 'completed', 'installed'],
    default : 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const openHouseSchema = mongoose.model('openHouseForm', formDataSchema)

module.exports = {openHouseSchema}
