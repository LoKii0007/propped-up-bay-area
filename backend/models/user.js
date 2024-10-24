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
      required: true,
    },
    role: { 
      type: String, 
      enum: ['user', 'superuser', 'admin'], 
      default: 'user' 
    },
    profileCompleted: {
      type: Boolean,
      default: false, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

const User = mongoose.model("Users", userSchema);

module.exports = User;
