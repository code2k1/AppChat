const mongoose = require("mongoose");
const { Schema } = mongoose;
const friendSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  //   Danh sách bạn bè cần mình đồng ý kết bạn
  list_wait: [
    {
      name: { type: String, default: null },
      phone: { type: String },
      avatar: { type: String },
    },
  ],
  list_friend: [
    {
      name: { type: String, default: null },
      phone: { type: String },
      avatar: { type: String },
    },
  ],
  //   Danh sách bạn bè mình đã gửi yêu cầu
  list_request: [
    {
      name: { type: String, default: null },
      phone: { type: String },
      avatar: { type: String },
    },
  ],
});

module.exports = mongoose.model("friend", friendSchema);
