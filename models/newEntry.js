const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const newEntry = new Schema({
  totalAmout: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  members: {
    type: Array,
    required: true,
  },
});

module.exports = Mongoose.model("New Entry", newEntry);
