const epxress = require("express");
const verifyToken = require("../../middleware/auth");
const Friend = require("../../model/friend");
const User = require("../../model/user");
const Room = require("../../model/room");
// const { verify } = require("jsonwebtoken");

const routerFriend = epxress.Router();

routerFriend.post("/request", verifyToken, async (req, res) => {
  try {
    const myUser = await User.findOne({ phone: req.user.phone });
    const { phone, name, avatar } = req.body;
    // console.log(phone + " " + name);
    if (!(phone && name)) {
      return res.status(401).send("Input is null");
    }

    const checkUserHandel = await Friend.find({ phone: req.user.phone });

    if (checkUserHandel.length === 0) {
      const requet_friend = await Friend.create({
        phone: req.user.phone,
        list_request: [{ phone: phone, name: name, avatar: avatar }],
      });
    } else {
      await Friend.findOneAndUpdate(
        { phone: req.user.phone },
        {
          $push: {
            list_request: {
              phone: phone,
              name: name,
              avatar: avatar,
            },
          },
        }
      );
    }

    const checkFriendHandel = await Friend.find({ phone: phone });
    if (checkFriendHandel.length === 0) {
      const wait_friend = await Friend.create({
        phone: phone,
        list_wait: [
          {
            phone: req.user.phone,
            name: `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
            avatar: myUser.avatar,
          },
        ],
      });
    } else {
      await Friend.findOneAndUpdate(
        { phone: phone },
        {
          $push: {
            list_wait: {
              phone: req.user.phone,
              name: `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
              avatar: myUser.avatar,
            },
          },
        }
      );
    }
    return res.status(200).send("Request add friend success");
  } catch (error) {
    return res.status(401).send(error);
  }
});

routerFriend.post("/apply", verifyToken, async (req, res) => {
  try {
    const { status, phone, name, avatar } = req.body;

    console.log("aaaaaaaaa");

    const myUser = await User.findOne({ phone: req.user.phone });
    if (status === null) {
      return res.status(401).send("Value null");
    }
    if (status === true) {
      await Friend.findOneAndUpdate(
        { phone: req.user.phone },
        {
          $push: {
            list_friend: {
              phone: phone,
              name: name,
              avatar: avatar,
            },
          },
        }
      );

      await Friend.findOneAndUpdate(
        {
          phone: req.user.phone,
          $and: [{ "list_wait.phone": phone }, { "list_wait.name": name }],
        },
        {
          $pull: {
            list_wait: { phone: phone, name: name },
          },
        }
      );

      await Friend.findOneAndUpdate(
        { phone: phone },
        {
          $push: {
            list_friend: {
              phone: req.user.phone,
              name: `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
              avatar: myUser.avatar,
            },
          },
        }
      );

      await Friend.findOneAndUpdate(
        {
          phone: phone,
          $and: [
            { "list_request.phone": req.user.phone },
            {
              "list_request.name": `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
            },
          ],
        },
        {
          $pull: {
            list_request: {
              phone: req.user.phone,
              name: `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
            },
          },
        }
      );

      // listmember l?? array g???m c??c phone
      const list_member = [{ phone: phone }];
      const name_room = "";
      // l???c phone l???y t??n m???c ?????nh t???ng phone
      let [newList_member] = ([] = await Promise.all(
        list_member.map(async (course, index) => {
          let user_member = await User.findOne(course);
          course.avatar = user_member.avatar;
          course.nickname = `${user_member.first_name.trim()} ${user_member.last_name.trim()}`;
          return list_member;
        })
      ));

      // add th??ng tin c?? nh??n m??nh v??o
      newList_member.push({
        phone: req.user.phone,
        nickname: `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
        avatar: myUser.avatar,
        role: "Admin",
      });

      // b???t ??i???u ki???n nh??m bao nhi??u thanh vi??n ( ????n hay nh??m )
      const count_member = newList_member.length;
      if (count_member > 2) {
        if (!name_room) {
          return res.status(400).send("Name room = null");
        }
      }

      if (count_member < 2) {
        return res.status(400).send(" Members < 2 ");
      }

      // Nh??m 2 ng?????i ???? t???n t???o room th?? kh??ng cho ph??p t???o n???a || 3 ng?????i mu???n t???o bao nhi??u nh??m chat v???n ???????c ~ t??n ph???i kh??c tr?????c
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
          res.status(401).send("Room is exist");
        }
      }

      // t???o nh??m chat
      const listChat = await Room.create({
        name_room: name_room || "isFriend",
        count_member: count_member,
        list_member: newList_member,
      });

      return res.status(201).send("Access friend success");
    }
    if (status === false) {
      await Friend.findOneAndUpdate(
        {
          phone: req.user.phone,
          $and: [{ "list_wait.phone": phone }, { "list_wait.name": name }],
        },
        {
          $pull: {
            list_wait: { phone: phone, name: name },
          },
        }
      );

      await Friend.findOneAndUpdate(
        {
          phone: phone,
          $and: [
            { "list_request.phone": req.user.phone },
            {
              "list_request.name": `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
            },
          ],
        },
        {
          $pull: {
            list_request: {
              phone: req.user.phone,
              name: `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
            },
          },
        }
      );
      return res.status(201).send("Denine friend success");
    }

    if (status === "cancel") {
      await Friend.findOneAndUpdate(
        {
          phone: req.user.phone,
          $and: [
            { "list_request.phone": phone },
            { "list_request.name": name },
          ],
        },
        {
          $pull: {
            list_request: { phone: phone, name: name },
          },
        }
      );
      await Friend.findOneAndUpdate(
        {
          phone: phone,
          $and: [
            { "list_wait.phone": req.user.phone },
            {
              "list_wait.name": `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
            },
          ],
        },
        {
          $pull: {
            list_wait: {
              phone: req.user.phone,
              name: `${myUser.first_name.trim()} ${myUser.last_name.trim()}`,
            },
          },
        }
      );

      return res.status(201).send("Cancel request add friend success");
    }
  } catch (error) {
    res.status(401).send(error);
  }
});

routerFriend.get("/", verifyToken, async (req, res) => {
  try {
    const list_friend = await Friend.findOne({ phone: req.user.phone });
    return res.status(201).send(list_friend);
  } catch (error) {
    return res.status(401).send(error);
  }
});
//Sua nick name cua friend
//Pass
routerFriend.post("/updateName", verifyToken, async (req, res) => {
  try {
    //Lay nick name duoc nhap vao de thay doi
    const { name, phone, newName } = req.body;
    //Tim va cap nhat ten moi
    const myFriend = await Friend.findOneAndUpdate(
      {
        //Sdt lay theo token (so dien thoai cua minh)
        phone: req.user.phone,
        //Dieu kien dong thoi: sdt va ten cu cua ban can sua ten
        $and: [{ "list_friend.phone": phone }, { "list_friend.name": name }],
      },
      {
        //Thay doi ten va ca sdt
        $set: {
          list_friend: {
            phone: phone,
            name: newName,
          },
        },
      }
    );

    if (myFriend) {
      res.status(201).send(myFriend);
    } else {
      res.status(401).send("Friend is not exist!!");
    }
  } catch (error) {
    console.log(error);
  }
});
//Huy ket ban
routerFriend.delete("/delFriend", verifyToken, async (req, res) => {
  try {
    const { phone, name } = req.body;

    const listFriend = await Friend.findOneAndUpdate(
      {
        phone: req.user.phone,
        $and: [{ "list_friend.phone": phone }, { "list_friend.name": name }],
      },
      {
        $pull: {
          list_friend: {
            name: name,
            phone: phone,
          },
        },
      }
    );

    if (listFriend) {
      res.status(201).send(listFriend);
    } else {
      res.status(401).send("Friend is not exist!!");
    }
  } catch (error) {
    console.log(error);
  }
});

//Tim ban be (khong tim ra minh)
routerFriend.get("/:name", verifyToken, async (req, res) => {
  try {
    const nameFriend = req.params.name;
    const friend = await Friend.findOne({ "list_friend.name": nameFriend });

    return res.status(201).send(friend);
  } catch (error) {
    console.log(error);
  }
});

// -------- chanh-dev

module.exports = routerFriend;
