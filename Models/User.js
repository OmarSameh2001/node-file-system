const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    photo: String,
    idFront: String,
    idBack: String,
  },
});

module.exports = mongoose.model('user', userSchema);
