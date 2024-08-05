const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: String,
  drive: {
    photo: String,
    idFront: String,
    idBack: String,
  },
  bucket: {
    photo: String,
    idFront: String,
    idBack: String,
  },
});

module.exports = mongoose.model("user", userSchema);
