const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📌 Using Database: ${conn.connection.name}`);
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(
      "📌 Collections in DB:",
      collections.map((c) => c.name)
    );
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
};

module.exports = connectDB;
