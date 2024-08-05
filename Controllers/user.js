// Services
const UserService = require('../services/user');
const GDrive = require('../clients/GoogleDriveClient');
const AWSS3 = require('../clients/AmazonS3Client');

// Delarations
const Users = new UserService();
const Drive = new GDrive();
const AWS = new AWSS3();

exports.create = async (req, res, next) => {
  try {
    // create folder in google drive
    const folderName = `${req.body.name}-${req.body.phone}`; // example
    const parent = 'change to your id'; // the id of parent (from url)
    const data = await Drive.createFolder(folderName, parent);
    const folderId = data.data.id;

    // upload files in google drive and aws
    const uploadedFiles = []; // for saving google id and aws url in mongo db

    // Loop through all files in req.files (created already by multer middleware)
    for (const fieldName in req.files) {
      const files = req.files[fieldName];
      for (const file of files) {
        const googleData = await Drive.createFile(file, folderId);
        const awsData = await AWS.uploadFile(file);
        uploadedFiles.push({
          type: fieldName,
          google: googleData,
          aws: awsData,
        });
      }
    }

    const result = await Users.create(req, uploadedFiles);
    res.status(201).send({ success: true, message: 'User created successfully', body: result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: err.message });
  }
};
exports.delete = async (req, res, next) => {
  try {
    const userId = req.params.id; // Assuming the user ID is a URL parameter

    // Fetch user to get file references
    const user = await Users.getById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }

    // Delete user from MongoDB
    await Users.delete(user);

    res.status(200).send({ success: true, message: 'User and files deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send({ success: false, message: err.message });
  }
};

