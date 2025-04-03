const express = require("express");

const {
  getAllWorkspaces,
  createWorkspace,
} = require("../controllers/workspaceController");

const router = express.Router();

router.get("/", getAllWorkspaces);
router.post("/", createWorkspace);

module.exports = router;
