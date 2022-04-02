const mongoose = require("mongoose");

// user is a foreign key
const NotesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String, default: "general" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("notes", NotesSchema);
