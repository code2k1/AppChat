require("dotenv").config();
require("./config/database").connect();

// config
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// routers
const routerAuth = require("./routes/auth/Auth.js");
const routerListChat = require("./routes/chat/ListChat.js");
const routerListMessage = require("./routes/chat/ListMess.js");
const routerUser = require("./routes/user/User");
const routerFriend = require("./routes/user/Friend");
const routerImage = require("./routes/images/Image");

app.use("/auth", routerAuth);
app.use("/user", routerUser);
app.use("/listchat", routerListChat);
app.use("/listmessage", routerListMessage);
app.use("/friend", routerFriend);
app.use("/images", routerImage);

module.exports = app;
