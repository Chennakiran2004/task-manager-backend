// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const boardRoutes = require("./routes/boardRoutes");

// dotenv.config({ path: ".env.local" });

// const app = express();
// app.use(express.json());
// app.use(cors());

// connectDB();

// app.use("/api/boards", boardRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const boardRoutes = require("./routes/boardRoutes");
const workspaceRoutes = require("./routes/workspaceRoute");

dotenv.config({ path: ".env.local" });

const app = express();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

connectDB();

app.use("/api/boards", boardRoutes);
app.use("/api/workspaces", workspaceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
