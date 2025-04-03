// const Board = require("../models/Board");
// const mongoose = require("mongoose");

// const getAllBoards = async (req, res) => {
//   console.log("API called to fetch boards");
//   try {
//     const boards = await Board.find({});
//     console.log("Fetched Boards:", boards);
//     res.json(boards);
//   } catch (error) {
//     console.error("Error fetching boards:", error);
//     res.status(500).json({ message: "Error fetching boards" });
//   }
// };

// const createBoard = async (req, res) => {
//   try {
//     const { title } = req.body;

//     if (!title || typeof title !== "string") {
//       return res.status(400).json({ message: "Invalid board title" });
//     }

//     const newBoard = new Board({
//       title,
//       lists: [],
//     });

//     const result = await newBoard.save();

//     return res.status(201).json(result);
//   } catch (error) {
//     console.error("Error creating board:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// const addList = async (req, res) => {
//   try {
//     const { boardId } = req.params;
//     console.log("Received boardId:", boardId);

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(boardId)) {
//       return res.status(400).json({ message: "Invalid Board ID format" });
//     }

//     // Find the board
//     const board = await Board.findById(boardId);
//     console.log("Board from DB:", board);

//     if (!board) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     // Parse request body
//     const { listName } = req.body;
//     if (!listName || typeof listName !== "string") {
//       return res.status(400).json({ message: "Invalid list name" });
//     }

//     // Create new list
//     const newList = {
//       _id: new mongoose.Types.ObjectId(),
//       listName,
//       taskIds: [],
//     };

//     // Add list to the board
//     board.lists.push(newList);
//     await board.save();

//     return res
//       .status(201)
//       .json({ message: "List added successfully", newList });
//   } catch (error) {
//     console.error("Error adding list:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const getLists = async (req, res) => {
//   try {
//     const { boardId } = req.params;
//     console.log("Received boardId:", boardId);

//     if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
//       console.error("Invalid boardId received:", boardId);
//       return res.status(400).json({ message: "Invalid Board ID format" });
//     }

//     const boardData = await Board.findById(boardId);

//     if (!boardData) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     return res.status(200).json({ lists: boardData.lists || [] });
//   } catch (error) {
//     console.error("Error fetching board lists:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const getTasks = async (req, res) => {
//   try {
//     const { boardId, listId } = req.params;
//     console.log("Received boardId:", boardId, "and listId:", listId);

//     // Validate ObjectId
//     if (
//       !mongoose.Types.ObjectId.isValid(boardId) ||
//       !mongoose.Types.ObjectId.isValid(listId)
//     ) {
//       return res.status(400).json({ message: "Invalid ID format" });
//     }

//     // Find the board
//     const board = await Board.findById(boardId);
//     if (!board) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     // Find the list in the board
//     const targetList = board.lists.find(
//       (list) => list._id.toString() === listId
//     );
//     if (!targetList) {
//       return res.status(404).json({ message: "List not found" });
//     }

//     return res.status(200).json({ tasks: targetList.taskIds || [] });
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// const addTask = async (req, res) => {
//   try {
//     const { boardId, listId } = req.params;
//     console.log("POST params:", { boardId, listId });

//     // Validate ObjectId
//     if (
//       !mongoose.Types.ObjectId.isValid(boardId) ||
//       !mongoose.Types.ObjectId.isValid(listId)
//     ) {
//       return res.status(400).json({ message: "Invalid ID format" });
//     }

//     const { taskName } = req.body;

//     if (!taskName) {
//       return res.status(400).json({ message: "Task name is required" });
//     }

//     // Find the board
//     const board = await Board.findById(boardId);
//     if (!board) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     // Find the list in the board
//     const targetList = board.lists.find(
//       (list) => list._id.toString() === listId
//     );
//     if (!targetList) {
//       return res.status(404).json({ message: "List not found" });
//     }

//     // Create a new task
//     const newTask = {
//       _id: new mongoose.Types.ObjectId(),
//       text: taskName,
//       createdAt: new Date(),
//     };

//     // Add the task to the list
//     targetList.taskIds.push(newTask);
//     await board.save();

//     return res.status(200).json({
//       message: "Task added successfully",
//       task: newTask,
//       updatedList: targetList,
//     });
//   } catch (error) {
//     console.error("Error adding task:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// const deleteList = async (req, res) => {
//   try {
//     const { boardId, listId } = req.params;
//     console.log("Received boardId:", boardId, "and listId:", listId);

//     // Validate ObjectId
//     if (
//       !mongoose.Types.ObjectId.isValid(boardId) ||
//       !mongoose.Types.ObjectId.isValid(listId)
//     ) {
//       return res.status(400).json({ message: "Invalid ID format" });
//     }

//     // Find the board
//     const board = await Board.findById(boardId);
//     if (!board) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     // Remove the list from the board
//     const listIndex = board.lists.findIndex(
//       (list) => list._id.toString() === listId
//     );
//     if (listIndex === -1) {
//       return res.status(404).json({ message: "List not found" });
//     }

//     board.lists.splice(listIndex, 1);
//     await board.save();

//     return res.status(200).json({ message: "List deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting list:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// module.exports = {
//   getAllBoards,
//   createBoard,
//   addList,
//   getLists,
//   getTasks,
//   addTask,
//   deleteList,
// };

const Board = require("../models/Board");
const mongoose = require("mongoose");

const getAllBoards = async (req, res) => {
  console.log("API called to fetch boards");
  try {
    const { workspaceId } = req.query; // Get workspaceId from query params
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
    const { title, workspaceId } = req.body; // Add workspaceId to the request body

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Invalid board title" });
    }

    if (!workspaceId || typeof workspaceId !== "string") {
      return res.status(400).json({ message: "Invalid workspaceId" });
    }

    const newBoard = new Board({
      title,
      workspaceId, // Include workspaceId
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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: "Invalid Board ID format" });
    }

    // Find the board
    const board = await Board.findById(boardId);
    console.log("Board from DB:", board);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Parse request body
    const { listName } = req.body;
    if (!listName || typeof listName !== "string") {
      return res.status(400).json({ message: "Invalid list name" });
    }

    // Create new list
    const newList = {
      _id: new mongoose.Types.ObjectId(),
      listName,
      taskIds: [],
    };

    // Add list to the board
    board.lists.push(newList);
    board.updatedAt = new Date(); // Update the updatedAt timestamp
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

    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(listId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the board
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Find the list in the board
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

    // Validate ObjectId
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

    // Find the board
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Find the list in the board
    const targetList = board.lists.find(
      (list) => list._id.toString() === listId
    );
    if (!targetList) {
      return res.status(404).json({ message: "List not found" });
    }

    // Create a new task
    const newTask = {
      _id: new mongoose.Types.ObjectId(),
      text: taskName,
      createdAt: new Date(),
    };

    // Add the task to the list
    targetList.taskIds.push(newTask);
    board.updatedAt = new Date(); // Update the updatedAt timestamp
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

    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(boardId) ||
      !mongoose.Types.ObjectId.isValid(listId)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the board
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Remove the list from the board
    const listIndex = board.lists.findIndex(
      (list) => list._id.toString() === listId
    );
    if (listIndex === -1) {
      return res.status(404).json({ message: "List not found" });
    }

    board.lists.splice(listIndex, 1);
    board.updatedAt = new Date(); // Update the updatedAt timestamp
    await board.save();

    return res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
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
};
