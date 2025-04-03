// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   text: String,
//   createdAt: Date,
// });

// const listSchema = new mongoose.Schema({
//   listName: String,
//   taskIds: [taskSchema],
// });

// const boardSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   lists: [listSchema],
// });

// module.exports = mongoose.model("boards", boardSchema);

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
  workspaceId: { type: String, required: true },
  title: { type: String, required: true },
  lists: [listSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("boards", boardSchema, "boards");
