const mongoose = require("mongoose");

const messSchema = new mongoose.Schema({
  id_room: { type: String },
  arthor: { type: String, default: null },
  mess_content: { type: String, default: null },
  time: { type: Date, default: new Date() },
  status: { type: Array, default: [] },
});

module.exports = mongoose.model("mess", messSchema);
