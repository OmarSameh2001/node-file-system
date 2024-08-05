const User = require("../models/User");

class UserService {
  constructor() {
    this.UserModel = User;
  }

  async create(newUser, uploadedFiles) {
    let googleDrive = {};
    let awsBucket = {};

    if (uploadedFiles) {
      uploadedFiles.forEach((file) => {
        if (file.type === "photo") {
          googleDrive.photo = file.google;
          awsBucket.photo = file.aws;
        }
        if (file.type === "idFront") {
          googleDrive.idFront = file.google;
          awsBucket.idFront = file.aws;
        }
        if (file.type === "idBack") {
          googleDrive.idBack = file.google;
          awsBucket.idBack = file.aws;
        }
      });
    }

    newUser.body.drive = googleDrive;
    newUser.body.bucket = awsBucket;

    const result = await this.UserModel.create(newUser.body);
    return result;
  }
  async getById(userId) {
    return await this.UserModel.findById(userId);
  }

  async delete(user) {
    
    // Helper function to extract AWS filename from URL
    const getFileName = (url) => decodeURIComponent(url.split("/").pop());

    const { drive, bucket } = user;

    // Delete files from Google Drive
    for (const key in drive) {
      await Drive.deleteFile(drive[key]);
    }

    // Delete files from AWS
    for (const key in bucket) {
      const fileName = getFileName(bucket[key]);
      await AWS.deleteFile(fileName);
    }
    return await this.UserModel.findByIdAndDelete(user._id);
  }
}

module.exports = UserService;
