const User = require('../models/User');

class UserService {
  constructor() {
    this.UserModel = User;
  }

  async create(newUser, uploadedFiles) {
    let files = {};

    if (uploadedFiles) {
      uploadedFiles.forEach((file) => {
        if (file.type === 'photo') {
          files.photo = file.id;
        }
        if (file.type === 'idFront') {
          files.idFront = file.id;
        }
        if (file.type === 'idBack') {
          files.idBack = file.id;
        }
      });
    }

    newUser.body.files = files;

    const result = await this.UserModel.create(newUser.body);
    return result;
  }
}

module.exports = UserService;
