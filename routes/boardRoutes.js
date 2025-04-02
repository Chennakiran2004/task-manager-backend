const express = require("express");
const {
  getAllBoards,
  createBoard,
  addList,
  getLists,
  getTasks,
  addTask,
  deleteList,
} = require("../controllers/boardController");

const router = express.Router();

router.get("/", getAllBoards);
router.post("/", createBoard);
router.post("/:boardId/lists", addList);
router.get("/:boardId/lists", getLists);
router.get("/:boardId/lists/:listId/tasks", getTasks);
router.post("/:boardId/lists/:listId/tasks", addTask);
router.delete("/:boardId/lists/:listId", deleteList);

module.exports = router;
