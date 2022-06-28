const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    max: 2048,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  auth: {
    type: String,
    default: "student",
  },
});

module.exports = mongoose.model("User", userSchema);