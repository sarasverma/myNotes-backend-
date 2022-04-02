const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Notes");

// ROUTER : 1   create new note
router.post(
  "/createnote",
  fetchuser,
  [
    body("title", "Enter valid user title").exists(),
    body("description", "Enter atleast 7 character for descrition").isLength({
      min: 7,
    }),
  ],
  async (req, res) => {
    // valididating parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tags } = req.body;
      const newNote = new Note({
        user: req.user.id,
        title: title,
        description: description,
        tags: tags,
      });
      const savedNote = await newNote.save();
      res.json(savedNote);
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTER : 2   fetch all notes of a user
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// ROUTER : 3   update a note
router.put("/updatenote:id", fetchuser, async (req, res) => {});

// ROURER : 4   delete a note
router.delete("/deletenote:id", fetchuser);

module.exports = router;
