// server/config/db.js
const mongoose = require('mongoose');

const getMongoUri = () =>
  (process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL || "").trim();

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    console.error(
      "Missing MongoDB URI. Set MONGO_URI in server/.env (or MONGODB_URI / DATABASE_URL)."
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
