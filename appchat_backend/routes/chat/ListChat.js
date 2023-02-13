const epxress = require("express");
const mongoose = require("mongoose");
const verifyToken = require("../../middleware/auth");

// Logic goes here
const Room = require("../../model/room");
const User = require("../../model/user");

const ObjectId = mongoose.Types.ObjectId;
const routerListChat = epxress.Router();

// get and post all
routerListChat.post("/", verifyToken, async (req, res) => {
  try {
    // listmember là array gồm các phone
    let { name_room, list_member } = req.body;
    const myUser = await User.findOne({ phone: req.user.phone });

    // lọc phone lấy tên mặc định từng phone
    let [newList_member] = ([] = await Promise.all(
      list_member.map(async (course, index) => {
        let user_member = await User.findOne(course);
        course.avatar = user_member.avatar;
        course.nickname = `${user_member.first_name.trim()} ${user_member.last_name.trim()}`;
        return list_member;
      })
    ));
    // add thông tin cá nhân mình vào
    newList_member.push({
      phone: req.user.phone,
      nickname: `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
      avatar: myUser.avatar,
      role: "Admin",
    });

    // bắt điều kiện nhóm bao nhiêu thanh viên ( đơn hay nhóm )
    const count_member = newList_member.length;
    if (count_member > 2) {
      if (!name_room) {
        return res.status(400).send("Name room = null");
      }
    }

    if (count_member < 2) {
      return res.status(400).send(" Members < 2 ");
    }
    // Nhóm 2 người đã tồn tạo room thì không cho phép tạo nữa || 3 người muốn tạo bao nhiêu nhóm chat vẫn được ~ tên phải khác trước
    if (count_member >= 2) {
      let [[check]] = ([] = await Promise.all(
        newList_member.map(async (course) => {
          const checkListChat = await Room.find({
            name_room: name_room || "isFriend",
            count_member: count_member,
            list_member: { $elemMatch: course },
          });
          if (checkListChat) {
            return checkListChat;
          }
        })
      ));

      if (check) {
        return res.status(401).send("Room is exist");
      }
    }

    // tạo nhóm chat
    const listChat = await Room.create({
      name_room: name_room || "isFriend",
      count_member: count_member,
      list_member: newList_member,
    });

    return res.status(201).json(listChat);
  } catch (err) {
    res.status(400).send(err);
  }
});

routerListChat.get("/", verifyToken, async (req, res) => {
  try {
    const listChat = await Room.find({ "list_member.phone": req.user.phone });
    res.status(200).send({ data: listChat });
  } catch (error) {
    res.send(error);
  }
});

routerListChat.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const room = await Room.aggregate([
      { $match: { _id: ObjectId(id) } },
      {
        $project: {
          _id: 1,
          room_type: 1,
          count_member: 1,
          name_room: 1,
          list_member: 1,
        },
      },
    ]);
    const listMessage = await Room.aggregate([
      { $match: { _id: ObjectId(id) } },
      {
        $replaceWith: {
          $mergeObjects: [
            {
              list_message: "$list_message",
              _id: "$_id",
            },
          ],
        },
      },
      { $unwind: "$list_message" },
      { $skip: 0 },
      { $limit: 10 },
      { $group: { _id: "$_id", list_message: { $push: "$list_message" } } },
      { $project: { list_message: 1, _id: 0 } },
    ]);
    if (listMessage[0]) {
      room[0].list_message = listMessage[0].list_message;
      return res.status(200).json(room[0]);
    } else {
      room[0].list_message = [];
      return res.status(200).json(room[0]);
    }
  } catch (error) {
    res.send(error);
  }
});

// get id
routerListChat.get("/:phone/:count_member", verifyToken, async (req, res) => {
  try {
    const phone = req.params.phone;
    const count_member = req.params.count_member;
    const listChat = await Room.find({
      $and: [
        { "list_member.phone": phone },
        { "list_member.phone": req.user.phone },
      ],
      count_member: count_member,
    });
    res.status(200).send(listChat);
  } catch (error) {
    res.send(error);
  }
});

routerListChat.get("/member", verifyToken, async (req, res) => {
  try {
    const data = [];
    (await Room.find()).forEach((result) => {
      return data.push({ id_room: result._id, member: result.member });
    });
    res.send(data);
  } catch (err) {
    res.send(err);
  }
});

// rename Room
routerListChat.put("/rename", verifyToken, async (req, res) => {
  try {
    const { room_id, name_room } = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(
      room_id,
      {
        name_room: name_room,
      },
      {
        new: true,
      }
    );
    if (!updatedRoom) {
      return res.status(404).send("Chat Not Found");
    } else {
      res.json(updatedRoom);
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});
// ChangeRole
routerListChat.put("/changeRole", verifyToken, async (req, res) => {
  try {
    const { room_id, phone } = req.body;
    const user_phone = req.user.phone;

    const room = await Room.findOne({ _id: room_id });
    const listMember = room.list_member;

    // Check Admin
    var isMatch = false;
    listMember.forEach(function (list_member) {
      if (list_member.phone === user_phone && list_member.role === "Admin") {
        console.log("isAdMin");
        isMatch = true;
      }
    });
    if (!isMatch) {
      return res.send("You are not admin");
    }

    // Chuyen role cho sdt da nhap
    const changRoleAdmin = await Room.update(
      {
        _id: room_id,
        "list_member.phone": phone,
      },
      {
        $set: {
          "list_member.$.role": "Admin",
        },
      }
    );
    // Chuyen role minh thanh user
    const changRoleUser = await Room.update(
      {
        _id: room_id,
        "list_member.phone": user_phone,
      },
      {
        $set: {
          "list_member.$.role": "",
        },
      }
    );
  } catch (error) {
    return res.status(400).send(error);
  }
});

routerListChat.get("/", verifyToken, async (req, res) => {
  try {
    const listChat = await Room.find({ "list_member.phone": req.user.phone });
    res.status(200).send({ data: listChat });
  } catch (error) {
    res.send(error);
  }
});

// add member
routerListChat.put("/addmember", verifyToken, async (req, res) => {
  try {
    const { room_id, phone, nickname } = req.body;

    const temp = await Room.findById(room_id);
    const temp1 = Object.keys(temp.list_member).length;
    const temp2 = temp1 + 1;

    const added = await Room.findByIdAndUpdate(
      room_id,
      {
        $push: {
          list_member: { phone: phone, nickname: nickname },
        },
        count_member: temp2,
      },
      {
        new: true,
      }
    );
    if (!added) {
      return res.status(404).send("Chat Not Found");
    } else {
      res.json(added);
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});

// remove room
routerListChat.put("/removeroom", verifyToken, async (req, res) => {
  try {
    const { room_id } = req.body;
    const removed = await Room.findByIdAndRemove(room_id, {
      new: true,
    });
    if (!removed) {
      return res.status(404).send("Chat Not Found");
    } else {
      res.send("Remove Room Success");
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});

// remove history chat
routerListChat.post("/remove_history", verifyToken, async (req, res) => {
  try {
    const { _id } = req.body;
    const listChat = await Room.findOne({ _id: _id });
    const list_message = listChat.list_message;

    let newList_Message = [];
    list_message.forEach((course) => {
      if (course.is_removes.length !== 0) {
        course.is_removes.some((phone) => {
          return phone.phone !== req.user.phone;
        }) && course.is_removes.push({ phone: req.user.phone });
      } else {
        course.is_removes.push({ phone: req.user.phone });
      }
      newList_Message.push(course);
    });

    const list_removeHistory = await Room.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        $set: {
          list_message: newList_Message,
        },
      }
    );
    return res.status(201).send(list_removeHistory);
  } catch (error) {
    return res.status(401).send(error);
  }
});

// Sang-dev
// remove member
routerListChat.put("/removemember", verifyToken, async (req, res) => {
  try {
    const { room_id, phone } = req.body;

    const user_phone = req.user.phone;
    if (phone === user_phone) {
      return res.send("Can't delete myself");
    }

    const room = await Room.findOne({ _id: room_id });
    const listMember = room.list_member;
    // Check Admin
    var isMatch = false;
    listMember.forEach(function (list_member) {
      if (list_member.phone === user_phone && list_member.role === "Admin") {
        console.log("isAdMin");
        isMatch = true;
      }
    });
    if (!isMatch) {
      return res.send("You not admin");
    }

    const temp = await Room.findById(room_id);
    const temp1 = Object.keys(temp.list_member).length;
    const temp2 = temp1 - 1;

    const remove = await Room.findByIdAndUpdate(
      room_id,
      {
        $pull: {
          list_member: { phone: phone },
        },
        count_member: temp2,
      },
      {
        new: true,
      }
    );
    if (!remove) {
      return res.status(404).send("Chat Not Found");
    } else {
      res.json(remove);
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});
// outGroup
routerListChat.put("/outGroup", verifyToken, async (req, res) => {
  try {
    const { room_id } = req.body;

    const user_phone = req.user.phone;

    const temp = await Room.findById(room_id);
    const temp1 = Object.keys(temp.list_member).length;
    const temp2 = temp1 - 1;

    const remove = await Room.findByIdAndUpdate(
      room_id,
      {
        $pull: {
          list_member: { phone: user_phone },
        },
        count_member: temp2,
      },
      {
        new: true,
      }
    );
    if (!remove) {
      return res.status(404).send("Chat Not Found");
    } else {
      res.json(remove);
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});

// ChangeRole
routerListChat.put("/changeRole", verifyToken, async (req, res) => {
  try {
    const { room_id, phone } = req.body;
    const user_phone = req.user.phone;

    const room = await Room.findOne({ _id: room_id });
    const listMember = room.list_member;

    // Check Admin
    var isMatch = false;
    listMember.forEach(function (list_member) {
      if (list_member.phone === user_phone && list_member.role === "Admin") {
        console.log("isAdMin");
        isMatch = true;
      }
    });
    if (!isMatch) {
      return res.send("You are not admin");
    }

    // Chuyen role cho sdt da nhap
    const changRoleAdmin = await Room.update(
      {
        _id: room_id,
        "list_member.phone": phone,
      },
      {
        $set: {
          "list_member.$.role": "Admin",
        },
      }
    );
    // Chuyen role minh thanh user
    const changRoleUser = await Room.update(
      {
        _id: room_id,
        "list_member.phone": user_phone,
      },
      {
        $set: {
          "list_member.$.role": "",
        },
      }
    );
  } catch (error) {
    return res.status(400).send(error);
  }
});

// remove room
routerListChat.put("/removeroom", verifyToken, async (req, res) => {
  try {
    const { room_id } = req.body;
    const removed = await Room.findByIdAndRemove(room_id, {
      new: true,
    });
    if (!removed) {
      return res.status(404).send("Chat Not Found");
    } else {
      res.send("Remove Room Success");
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});

routerListChat.put("/demo", verifyToken, async (req, res) => {
  try {
    const { room_id } = req.body;
    const temp = await Room.findById(room_id, {
      list_message: { type_message: "image" },
    });
    const temp1 = temp.list_message;
    res.send(temp);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = routerListChat;
