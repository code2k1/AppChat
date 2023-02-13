const epxress = require("express");
const mongoose = require("mongoose");

const verifyToken = require("../../middleware/auth");
// Logic goes here
const Room = require("../../model/room");
const User = require("../../model/user");
const ObjectId = mongoose.Types.ObjectId;
const routerListMess = epxress.Router();

routerListMess.post("/addMessage", verifyToken, async (req, res) => {
  try {
    const { id_room, mess_content, name, type_message, avatar } = req.body;
    if (!(id_room && mess_content)) {
      return res.status(400).send("All input is required");
    }

    const temp = await Room.findOneAndUpdate(
      { _id: id_room },
      {
        $push: {
          list_message: {
            $each: [
              {
                arthor: { phone: req.user.phone, name: name, avatar: avatar },
                type_message: type_message,
                mess_content: mess_content,
              },
            ],
            $position: 0,
          },
        },
      }
    );

    const room = await Room.findOne({ _id: id_room });
    const message = room.list_message[0];
    return res.status(201).json(message);
  } catch (error) {
    console.log(error);
  }
});

routerListMess.post("/delete", verifyToken, async (req, res) => {
  try {
    const { id_room, index } = req.body;

    const temp = await Room.findOneAndUpdate(
      {
        _id: id_room,
      },
      {
        $pull: { list_message: { _id: "6368e715c4ba57a7560be1a1" } },
      }
    );
    return res.status(201).json(temp);
  } catch (error) {
    console.log(error);
  }
});

routerListMess.post("/deleteTo", verifyToken, async (req, res) => {
  try {
    const { id_room, index } = req.body;

    const phone = req.user.phone;

    const temp = await Room.findOneAndUpdate(
      {
        _id: id_room,
      },
      {
        $push: {
          [`list_message.${index}.is_removes`]: { phone: phone },
        },
      }
    );
    const temp2 = await Room.findOne({
      _id: id_room,
    });
    return res.status(201).json(temp2);
  } catch (error) {
    console.log(error);
  }
});

routerListMess.post("/revoke", verifyToken, async (req, res) => {
  try {
    const { id_room, index } = req.body;

    const temp = await Room.findOneAndUpdate(
      {
        _id: id_room,
      },
      {
        $set: {
          [`list_message.${index}.mess_content`]: "",
        },
      }
    );
    const temp2 = await Room.findOne({
      _id: id_room,
    });
    return res.status(201).json(temp2);
  } catch (error) {
    console.log(error);
  }
});

// routerListMess.post("/deleteMessageTo", async (req, res) => {
//   try {
//     const { id_room, id_message } = req.body;
//     const temp = await Room.find(
//       { _id: id_room, "list_message._id": id_message }

//       // {
//       //   $pull: {
//       //     list_message: { _id: id_message },
//       //   },
//       // }
//     );
//     // const room = await Room.findOne({ _id: id_room });
//     return res.status(201).json(temp);
//   } catch (error) {
//     console.log(error);
//   }
// });

routerListMess.get("/listmess/:id_room/:skip/:limit", async (req, res) => {
  try {
    const id_room = req.params.id_room;
    const skip = parseInt(req.params.skip);
    const limit = parseInt(req.params.limit);

    const listMessage = await Room.aggregate([
      { $match: { _id: ObjectId(id_room) } },
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
      { $skip: skip },
      { $limit: limit },
      { $group: { _id: "$_id", list_message: { $push: "$list_message" } } },
      { $project: { list_message: 1, _id: 0 } },
    ]);

    // console.log(listMessage[0].list_message);
    return res.status(201).json(listMessage[0].list_message);
  } catch (error) {
    console.log(error);
  }
});

// chanh-dev
routerListMess.post("/addMessageFile", verifyToken, async (req, res) => {
  try {
    const { list_file } = req.body;

    let [newListFile] = ([] = await Promise.all(
      list_file.map(async (course, index) => {
        let abc = await Room.findOneAndUpdate(
          { _id: course.id_room },
          {
            $push: {
              list_message: {
                $each: [
                  {
                    arthor: {
                      phone: req.user.phone,
                      name: course.name,
                      avatar: course.avatar,
                    },
                    type_message: course.type_message,
                    mess_content: course.mess_content,
                  },
                ],
                $position: 0,
              },
            },
          }
        );
        if (list_file.length - 1 === index) {
          return abc;
        }
      })
    ));

    const room = await Room.findOne({ _id: list_file[0].id_room });

    let list_messageFile = [];

    for (let i = 0; i < list_file.length; i++) {
      list_messageFile.push(room.list_message[i]);
    }

    res.send(list_messageFile);
  } catch (error) {
    console.log(error);
  }
});

// add emoji
routerListMess.post("/add_emoji", verifyToken, async (req, res) => {
  try {
    const { type_Emoji, id_Room, id_Mess } = req.body;
    const my_user = await User.findOne({ phone: req.user.phone });
    const user_Name =
      my_user.first_name.trim() + " " + my_user.last_name.trim();

    let room = await Room.findOne({ _id: id_Room });

    let ListMess = room.list_message;

    ListMess.forEach((list, index) => {
      if (list._id.toString() === id_Mess) {
        if (list.list_emoji.length === 0) {
          ListMess[index].list_emoji.push({
            phone: req.user.phone,
            name: user_Name,
            emoji: [{ count: 1, type_emoji: type_Emoji }],
          });
        } else {
          if (
            list.list_emoji.some((course) => course.phone === req.user.phone)
          ) {
            let dem = 0;
            list.list_emoji.forEach((course, indexList) => {
              if (course.phone === req.user.phone) {
                course.emoji.forEach((item, index_Emoji) => {
                  if (item.type_emoji === type_Emoji) {
                    dem++;
                    ListMess[index].list_emoji[indexList].emoji[
                      index_Emoji
                    ].count = item.count + 1;
                  } else {
                    if (course.emoji.length - 1 === index_Emoji && dem === 0) {
                      ListMess[index].list_emoji[indexList].emoji.push({
                        count: 1,
                        type_emoji: type_Emoji,
                      });
                    }
                  }
                });
              }
            });
          } else {
            ListMess[index].list_emoji.push({
              phone: req.user.phone,
              name: user_Name,
              emoji: [{ count: 1, type_emoji: type_Emoji }],
            });
          }
        }
      }
    });

    const new_listMess = await Room.findOneAndUpdate(
      { _id: id_Room },
      { $set: { list_message: ListMess } }
    );
    return res.send(new_listMess);
  } catch (error) {
    return res.status(401).send(error);
  }
});

module.exports = routerListMess;
