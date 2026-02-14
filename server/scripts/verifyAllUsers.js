const mongoose = require("mongoose");
const User = require("../models/userModel");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected");
    await User.updateMany({}, { $set: { isVerified: true } });
    console.log("Migration complete");
    process.exit();
  })
  .catch((err) => console.error(err));
