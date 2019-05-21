const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  addedBills: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Bill'
    }
  ]
})

module.exports = mongoose.model('User', UserSchema);
