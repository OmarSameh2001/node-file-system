// Services
const UserService = require('../services/user');
const GDrive = require('../clients/GoogleDriveClient');

// Delarations
const Users = new UserService();
const Drive = new GDrive();

exports.create = async (req, res, next) => {
  try {
    // create folder in google drive
    const folderName = `${req.body.name}-${req.body.phone}`; // example
    const parent = 'change to your id'; // the id of parent (from url)
    const data = await Drive.createFolder(folderName, parent);
    const folderId = data.data.id;

    // upload files in the recently created folder
    const uploadedFiles = []; // for saving file id in mongo db
    // Loop through all files in req.files (created already by multer middleware)
    for (const fieldName in req.files) {
      const files = req.files[fieldName];
      for (const file of files) {
        const fileData = await Drive.createFile(file, folderId);
        uploadedFiles.push({
          type: fieldName,
          ...fileData,
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

