const User = require("../../model/user");
const epxress = require("express");
const verifyToken = require("../../middleware/auth");
const Room = require("../../model/room");

const bcrypt = require("bcryptjs");

const routerUser = epxress.Router();

routerUser.get("/friend", verifyToken, async (req, res) => {
  try {
    const users = await User.findOne({ _id: req.user.user_id });
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

routerUser.post("/addFriend", verifyToken, async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { phone } = req.body;
    const _id = req.user.user_id;
    const user = await User.findOne({ phone: phone });
    User.findOneAndUpdate(
      { _id: _id },
      {
        $push: {
          list_friend: {
            _id: user._id,
            name: user.first_name + " " + user.last_name,
            phone: user.phone,
          },
        },
      },
      (error, data) => {
        if (error) {
          // res.status(400).send(error);
        } else {
          // res.status(201).send(data);
        }
      }
    );

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

routerUser.get("/:phone", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const phone = req.params.phone;
    const user = await User.findOne({ phone: phone });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

routerUser.post("/add", verifyToken, async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { phone } = req.body;
    const _id = req.user.user_id;

    const user = await User.findOne({ phone: phone });
    const you = await User.findOne({ _id: _id });

    const nickname1 = (you.first_name + " " + you.last_name).split(" ");
    const name1 = nickname1[nickname1.length - 1] + " " + nickname1[0];
    const nickname2 = (user.first_name + " " + user.last_name).split(" ");
    const name2 = nickname2[nickname2.length - 1] + " " + nickname2[0];

    const listChat = await Room.create({
      name_room: "isFriend",
      count_member: 2,
      room_type: true,
      list_member: [
        { phone: you.phone, nickname: name1 },
        { phone: user.phone, nickname: name2 },
      ],
    });

    return res.status(200).json(listChat);
  } catch (err) {
    return res.status(401).send(err);
  }
});

routerUser.post("/findPhone", async (req, res) => {
  try {
    const { phone } = req.body;
    const oldUser = await User.findOne({ phone: phone });
    return res.json(oldUser);
  } catch (error) {
    console.log(error);
  }
});

routerUser.post("/resetPassword", async (req, res) => {
  try {
      const { phone, password } = req.body

      encryptedPassword = await bcrypt.hash(password, 10);

      const ressetPassword = await User.update(
        {
          phone: phone
        },
        {
          "$set":{
            password: encryptedPassword
          }
        }
      )
      return res.send("success")
  } catch (error) {
      console.log(error)
  }
})

// chanh-dev
// tìm dựa vào tên ( trừ bản thân mình )
routerUser.get("/find_name/:name", verifyToken, async (req, res) => {
  try {
    console.log("da vao");
    const name = req.params.name.split(" ");
    let first_name = "";
    let last_name = "";
    const my_user = await User.findOne({ phone: req.user.phone });
    const me_firstName = my_user.first_name.trim();
    const me_lastName = my_user.last_name.trim();
    name.forEach((course, index) => {
      if (index === name.length - 1) {
        last_name = course.trim();
      } else {
        first_name = `${first_name} ${course}`.trim();
      }
    });

    const userByName = await User.findOne({
      $and: [
        {
          first_name: first_name,
          last_name: last_name,
        },
        {
          $and: [
            {
              first_name: { $ne: me_firstName },
            },
            {
              last_name: { $ne: me_lastName },
            },
          ],
        },
      ],
    });
    return res.status(201).send(userByName);
  } catch (error) {
    console.log(error);
    return res.status(401).send(error);
  }
});

// tìm dựa vào phone ( trừ bản thân mình )
routerUser.get("/find_phone/:phone", verifyToken, async (req, res) => {
  try {
    const phone = req.params.phone;
    const me_phone = req.user.phone;
    const userByPhone = await User.findOne({
      $and: [
        {
          phone: phone,
        },
        {
          phone: { $ne: me_phone },
        },
      ],
    });
    return res.status(201).send(userByPhone);
  } catch (error) {
    return res.status(401).send(error);
  }
});
module.exports = routerUser;
