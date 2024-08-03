const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    },
    phone: String,
    files: {
        photo: String,
        idFront: String,
        idBack: String,}
  },
);

module.exports = mongoose.model('user', userSchema);
