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
    phone: {
      type: Number,
    //   required: true,
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
    role: { 
      type: String, 
      enum: ['user', 'superuser', 'admin'], 
      default: 'user' 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const SuperUser = mongoose.model("SuperUser", userSchema);

module.exports = SuperUser;
