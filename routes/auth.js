const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "thisisasecret";

// Route 1:  create sign up for new user
router.post(
  "/create_user",
  [
    body("name", "Enter valid user name").isLength({ min: 5 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter valid password").isLength({ min: 7 }),
  ],
  async (req, res) => {
    // valididating parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check user with given email already exists
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // save new user to the collection
      newUser = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      // send the authentication token as a response
      const data = { user: { id: newUser.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.status(200).json({ authtoken: authtoken });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// Route 2 : Login for user
router.post(
  "/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // valididating parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      // find user with given email
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please enter valid credentials" });
      }
      // compare password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      // send the authentication token as a response
      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.status(200).json({ authtoken: authtoken });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// Route 3 : get logged in user info
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    // find user by id
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
