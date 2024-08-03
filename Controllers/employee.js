// Services
const UserService = require('../services/user');
const GDrive = require('../clients/GoogleDriveClient');

// Delarations
const Employees = new EmployeeService();
const Drive = new GDrive();

// node module
const fs = require('fs');
const path = require('path');
const deleteFile = require('../../../utils/tools/deleteFile');

exports.create = async (req, res, next) => {
  try {
    // create folder in google drive
    const folderName = `${req.body.name}-${req.body.number}`; // example
    const parent = '1Fjo2zDBfSZUY4POsQdpjNzVq99QzqODV'; // the id of parent (from url)
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

    const result = await Employees.create(req, uploadedFiles);
    res.status(201).send({ success: true, message: 'User created successfully', body: result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: err.message });
  }
};

