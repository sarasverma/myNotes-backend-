const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");

// create sign up for new user
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
    const newUser = User(req.body);

    // check user with given email already exists
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // save new user to the collection
    newUser
      .save()
      .then(() => {
        res.status(200).json(newUser);
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  }
);

module.exports = router;
