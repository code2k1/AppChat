const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const { Server } = require("socket.io");

const verifyToken = require("./middleware/auth");
const User = require("./model/user");
const jwt = require("jsonwebtoken");

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// socket
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let rooms = [];
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    // console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("active_account", (data) => {
    data.data.list_friend &&
      data.data.list_friend.forEach((room) => {
        io.sockets.in(room.phone).emit("receive_friendActive", data.data);
      });
    socket[socket.id] = data.data;
  });

  socket.on("send_message", (data) => {
    io.sockets.in(data.data.id_room).emit("receive_message", data.data);
  });

  socket.on("send_ListFile", (data) => {
    io.sockets.in(data.data.id_room).emit("receive_listFileMess", data.data);
  });

  socket.on("create_ChatGroup", (data) => {
    data.data.id_room.forEach((room) => {
      io.sockets.in(room.phone).emit("receive_ChatGroup", data.data);
    });
  });

  socket.on("request_Add_Friend", (data) => {
    io.sockets.in(data.phone).emit("receive_Request_Add_Friend", data);
    io.sockets.in(data.phoneMe).emit("receive_Request_Add_Friend", data);
  });

  // socket.on("accept_Friend", (data) => {
  //   io.sockets.in(data.data.phone).emit("receive_Accept_Friend", data.data);
  // });

  // socket.on("refuse_Friend", (data) => {
  //   data.data.id_room.forEach((room) => {
  //     io.sockets.in(room.phone).emit("receive_Refuse_Friend", data.data);
  //   });
  // });

  socket.on("rename_Room", (data) => {
    data.data.list_member.forEach((room) => {
      io.sockets.in(room.phone).emit("receive_ChangeName", data);
    });
  });

  socket.on("recall_message", (data) => {
    io.sockets.in(data.data.id_room).emit("receive_recallMess", data.data);
  });

  socket.on("typing_message", (data) => {
    io.sockets.in(data.data.id_room).emit("receive_TypingMess", data.data);
  });

  socket.on("delete_history", (data) => {
    io.sockets.in(data.myPhone).emit("receive_DeleteHistory", data);
  });

  socket.on("add_emoji", (data) => {
    io.sockets.in(data.data.id_room._id).emit("receive_emoji", data.data);
  });

  socket.on("remove_member", (data) => {
    io.sockets.in(data.data.id_room).emit("receive_removeMember", data.data);
    io.sockets
      .in(data.data.phone_remove)
      .emit("receive_removeMember", data.data);
  });

  socket.on("change_role", (data) => {
    io.sockets.in(data.data.id_room).emit("receive_changeRole", data.data);
  });

  socket.on("remove_room", (data) => {
    io.sockets.in(data.phone).emit("receive_removeRoom", data);
  });

  socket.on("out_room", (data) => {
    io.sockets.in(data.data.phone).emit("receive_outRoom", data.data);
    io.sockets.in(data.data.id_room).emit("receive_outRoom", data.data);
  });

  socket.on("joinRoomCall", (room, id_User, phone) => {
    console.log(room);
    io.sockets.in(room).emit("receive_RoomCall", id_User, phone);
  });

  socket.on("disconnect", async () => {
    let myDisConnect = socket[socket.id];
    myDisConnect &&
      myDisConnect.list_friend &&
      myDisConnect.list_friend.forEach((room) => {
        io.sockets.in(room.phone).emit("receive_removeActive", myDisConnect);
      });

    myDisConnect &&
      (await User.findOneAndUpdate(
        { phone: myDisConnect.myActive },
        { $set: { active: new Date() } }
      ));

    console.log("User Disconnected", socket.id);
  });
});

// server listening
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
