const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  user_id: String,
  data: [Object],
});

mongoose.model("user", userSchema);
