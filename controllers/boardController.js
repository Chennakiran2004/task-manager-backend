const Board = require("../models/Board");
const mongoose = require("mongoose");

const getAllBoards = async (req, res) => {
  console.log("API called to fetch boards");
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required" });
    }

    const boards = await Board.find({ workspaceId });
    console.log("Fetched Boards:", boards);
    res.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ message: "Error fetching boards" });
  }
};

const createBoard = async (req, res) => {
  try {
    const { title, workspaceId } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Invalid board title" });
    }

    if (!workspaceId || typeof workspaceId !== "string") {
      return res.status(400).json({ message: "Invalid workspaceId" });
    }

    const newBoard = new Board({
      title,
      workspaceId,
      lists: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await newBoard.save();

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating board:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addList = async (req, res) => {
  try {
    const { boardId } = req.params;
    console.log("Received boardId:", boardId);

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: "Invalid Board ID format" });
    }

    const board = await Board.findById(boardId);
    console.log("Board from DB:", board);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const { listName } = req.body;
    if (!listName || typeof listName !== "string") {
      return res.status(400).json({ message: "Invalid list name" });
    }

    const newList = {
      _id: new mongoose.Types.ObjectId(),
      listName,
      taskIds: [],
    };

    board.lists.push(newList);
    board.updatedAt = new Date();
    await board.save();

    return res
      .status(201)
      .json({ message: "List added successfully", newList });
  } catch (error) {
    console.error("Error adding list:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLists = async (req, res) => {
  try {
    const { boardId } = req.params;
    console.log("Received boardId:", boardId);

    if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
      console.error("Invalid boardId received:", boardId);
      return res.status(400).json({ message: "Invalid Board ID format" });
    }

    const boardData = await Board.findById(boardId);

    if (!boardData) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.status(200).json({ lists: boardData.lists || [] });
  } catch (error) {
    console.error("Error fetching board lists:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTasks = async (req, res) => {
  try {
    const { boardId, listId } = req.params;
    console.log("Received boardId:", boardId, "and listId:", listId);

    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(listId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const targetList = board.lists.find(
      (list) => list._id.toString() === listId
    );
    if (!targetList) {
      return res.status(404).json({ message: "List not found" });
    }

    return res.status(200).json({ tasks: targetList.taskIds || [] });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const { boardId, listId } = req.params;
    console.log("POST params:", { boardId, listId });

    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(listId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const { taskName } = req.body;

    if (!taskName) {
      return res.status(400).json({ message: "Task name is required" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const targetList = board.lists.find(
      (list) => list._id.toString() === listId
    );
    if (!targetList) {
      return res.status(404).json({ message: "List not found" });
    }

    const newTask = {
      _id: new mongoose.Types.ObjectId(),
      text: taskName,
      createdAt: new Date(),
    };

    targetList.taskIds.push(newTask);
    board.updatedAt = new Date();
    await board.save();

    return res.status(200).json({
      message: "Task added successfully",
      task: newTask,
      updatedList: targetList,
    });
  } catch (error) {
    console.error("Error adding task:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteList = async (req, res) => {
  try {
    const { boardId, listId } = req.params;
    console.log("Received boardId:", boardId, "and listId:", listId);

    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(listId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const listIndex = board.lists.findIndex(
      (list) => list._id.toString() === listId
    );
    if (listIndex === -1) {
      return res.status(404).json({ message: "List not found" });
    }

    board.lists.splice(listIndex, 1);
    board.updatedAt = new Date();
    await board.save();

    return res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateListName = async (req, res) => {
  try {
    const { boardId, listId } = req.params;
    const { listName } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const targetList = board.lists.find(
      (list) => list._id.toString() === listId
    );
    if (!targetList) {
      return res.status(404).json({ message: "List not found" });
    }

    targetList.listName = listName;
    board.updatedAt = new Date();
    await board.save();

    return res.status(200).json({
      message: "List name updated successfully",
      updatedList: targetList,
    });
  } catch (error) {
    console.error("Error updating list name:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getAllBoards,
  createBoard,
  addList,
  getLists,
  getTasks,
  addTask,
  deleteList,
  updateListName,
};
