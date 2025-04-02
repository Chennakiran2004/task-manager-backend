const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: String,
  createdAt: Date,
});

const listSchema = new mongoose.Schema({
  listName: String,
  taskIds: [taskSchema],
});

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lists: [listSchema],
});

module.exports = mongoose.model("boards", boardSchema);
