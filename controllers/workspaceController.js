const Workspace = require("../models/WorkSpace");

const getAllWorkspaces = async (req, res) => {
  console.log("API called to fetch workspaces");
  try {
    const workspaces = await Workspace.find({});
    console.log("Fetched Workspaces:", workspaces);
    res.json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({ message: "Error fetching workspaces" });
  }
};

const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Invalid workspace name" });
    }

    const newWorkspace = new Workspace({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await newWorkspace.save();

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating workspace:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllWorkspaces,
  createWorkspace,
};
