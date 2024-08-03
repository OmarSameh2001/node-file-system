// Model
const Employee = require('../models/User');

// Errors

//---------------------------------------------------// Page Break

class UserService {
  constructor() {
    super(Employee);
  }
  async create(newUser, uploadedFiles) {

    let files = {};
    
    // Gdrive
    if (uploadedFiles) {
      uploadedFiles.forEach((file) => {
        if (file.type === 'photo'){
          files.photo = file.id;
        }
        if (file.type === 'idFront') {
         files.idFront(file.id);
        }
        if (file.type === 'idBack') {
         files.idBack(file.id);
        }
      })
    }
    
    newUser.body.files = files;

    const result = await this.MongooseClient.create(newUser.body);

    return result;
  }
}

module.exports = UserService;
