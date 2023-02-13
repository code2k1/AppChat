const mongoose = require("mongoose");
const { Schema } = mongoose;
const chatSchema = new mongoose.Schema({
  room_type: { type: Boolean, default: false },
  count_member: { type: Number, default: 2 },
  name_room: { type: String, unique: false },

  list_message: [
    {
      type_message: {
        type: { type: String, default: "text" },
        name: { type: String, default: "" },
        size: { type: Number, default: 0 },
      },
      list_emoji: [
        {
          name: { type: String },
          phone: { type: String },
          emoji: [{ type_emoji: { type: String }, count: { type: Number } }],
        },
      ],
      arthor: {
        phone: { type: String },
        name: { type: String },
        avatar: { type: String },
      },
      mess_content: { type: String },
      time: { type: Date, default: Date.now },
      is_removes: { type: Array },
    },
  ],
  list_member: [
    {
      phone: { type: String },
      nickname: { type: String, default: " " },
      role: { type: String, default: "" },
      avatar: { type: String },
    },
  ],
});

module.exports = mongoose.model("room", chatSchema);
