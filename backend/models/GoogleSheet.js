const mongoose = require("mongoose");

const sheetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique to prevent duplicates
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  openHouseOrdersSpreadsheetId: {
    type: String, // For Propped Up OpenHouse Orders
    required: false,
  },
  postHouseOrdersSpreadsheetId: {
    type: String, // For Propped Up PostHouse Orders
    required: false,
  },
  usersSpreadsheetId: {
    type: String, // For Propped Up Users
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GoogleSheetUsers = mongoose.model("GoogleSheetUser", sheetSchema);

module.exports = GoogleSheetUsers;
