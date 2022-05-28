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
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tags } = req.body;
  // updated Note
  const updatedNote = {};
  if (title) {
    updatedNote.title = title;
  }
  if (description) {
    updatedNote.description = description;
  }
  if (tags) {
    updatedNote.tags = tags;
  }

  let note = await Note.findById(req.params.id);
  if (!note) {
    res.status(500).send("Not found");
  }

  // check whether user owns the note
  if (req.user.id !== note.user.toString()) {
    res.status(401).send("Access denined");
  }
  note = await Note.findByIdAndUpdate(
    req.params.id,
    { $set: updatedNote },
    { new: true }
  );
  res.status(200).json({ note });
});

// ROURER : 4   delete a note
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  let note = await Note.findById(req.params.id);
  if (!note) {
    res.status(500).send("Not found");
  }
  // check whether user owns the note
  if (req.user.id !== note.user.toString()) {
    res.status(401).send("Access denined");
  }
  note = await Note.findByIdAndDelete(req.params.id);
  res.status(200).send({ succes: "Deleted successfully!" });
});

module.exports = router;
