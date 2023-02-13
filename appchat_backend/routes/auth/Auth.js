const epxress = require("express");

const routerAuth = epxress.Router();
const verifyToken = require("../../middleware/auth");

// Logic goes here
const User = require("../../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

routerAuth.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { phone, password } = req.body;

    // Validate user input
    if (!(phone && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ phone });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, phone },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
          // expiresIn: "1m",
        }
      );

      // save user token
      user.token = token;

      await User.findOneAndUpdate(
        { phone },
        { $set: { active: "Vừa mới truy cập" } }
      );

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

routerAuth.post("/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, phone, password } = req.body;

    // Validate user input
    if (!(phone && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ phone });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      avatar: `https://ui-avatars.com/api/background=random&?name=${first_name.trim()} ${last_name.trim()}&font-size=0.35&color=#fff`,
      first_name,
      last_name,
      phone: phone.toLowerCase(), // sanitize: convert phone to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, phone },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

routerAuth.post("/exist_account", async (req, res) => {
  try {
    const { phone } = req.body;
    const oldUser = await User.findOne({ phone });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    } else return res.status(200).send("User verify");
  } catch (error) {
    console.log(err);
  }
});

routerAuth.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.user.phone });
    res.status(200).send(user);
  } catch (error) {
    res.send(error);
  }
});

routerAuth.put("/online", verifyToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { phone: req.user.phone },
      { $set: { active: "Vừa mới truy cập" } }
    );

    return res.status(201).send(user);
  } catch (error) {
    return res.status(401).send(error);
  }
});

routerAuth.put("/offline", verifyToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { phone: req.user.phone },
      { $set: { active: new Date() } }
    );

    return res.status(201).send(user);
  } catch (error) {
    return res.status(401).send(error);
  }
});

module.exports = routerAuth;
