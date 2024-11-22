const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  count: { type: Number, default: 1 },
});

const orderCounterSchema = mongoose.model('OrderCounter', Schema);

module.exports = orderCounterSchema;
