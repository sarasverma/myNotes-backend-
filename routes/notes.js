const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  obj = { name: "notes", data: "test" };
  res.json(obj);
});

module.exports = router;
