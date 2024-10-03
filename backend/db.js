const mongoose = require("mongoose");
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error('MONGODB_URL is not defined in the environment variables');
  process.exit(1);
}

const Connection = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = Connection