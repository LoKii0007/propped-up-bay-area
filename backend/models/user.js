const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String, 
      unique: true,
      sparse: true, // Allows it to be optional and unique across entries
    },
    totalOrders : {
      type: Number,
      default : 0
    },
    isSubscribed : {
      type : Boolean,
      default : false
    },
    totalSpent:{
      type: Number,
      default : 0
    },
    profileCompleted: {
      type: Boolean,
      default: false, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    connectedAccounts: [String]
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;
