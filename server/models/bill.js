const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillSchema = new Schema({
  name: String,
  amount: Number,
  date: Date,
  userId: String
})

module.exports = mongoose.model('Bill', BillSchema);
