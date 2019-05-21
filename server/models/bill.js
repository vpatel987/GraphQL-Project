const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },

  // mongodb has a type of date, so we set the type to Date rather than String
  date: {
    type: Date,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Bill', BillSchema);
