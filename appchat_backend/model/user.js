const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  phone: { type: String, unique: true },
  password: { type: String },
  avatar: { type: String, default: null },
  active: { type: String, default: null },
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);
