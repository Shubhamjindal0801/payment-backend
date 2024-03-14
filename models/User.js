const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const User = new Schema({
  uid: {
    type: String,
    required: true,
  },
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
  },
  password: {
    type: String,
    required: true,
  },
  lastSessionId: {
    type: String,
    required: false,
  },
  totalPaymentCount: {
    type: Number,
    default: 0,
    required: false,
  },
});

module.exports = Mongoose.model("User Details", User);
