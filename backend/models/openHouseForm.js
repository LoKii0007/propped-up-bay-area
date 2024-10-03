const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/, // Simple regex for email validation
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /\(\d{3}\) \d{3}-\d{4}/, // (000) 000-0000 format
  },
  eventDetails: {
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // Could be enhanced with a specific time type
    endTime: { type: String, required: true },
    address: {
      streetAddress: { type: String, required: true },
      streetAddress2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
  },
  zone: {
    type: String,
    required: true,
  },
  additionalSigns: {
    quantity: { type: Number, default: 0 },
    addressPrintOnEach: { type: Boolean, default: false },
  },
  twilightTours: {
    type: String,
    enum: [
      "Slot 1 - 5 p.m. - 7 p.m.",
      "Slot 2 - 6 p.m. - 8 p.m.",
      "Not opting for twilight tours",
    ],
    required: true,
  },
  addressToBePrinted: {
    streetAddress: { type: String },
    streetAddress2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
  },
  additionalInstructions: {
    type: String,
  },
  total: {
    type: Number,
    default: 0,
  },
});

const OpenHouseForm = mongoose.model("OpenHouseForm", EventSchema);

module.exports = OpenHouseForm;
