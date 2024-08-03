// Services
const EmployeeService = require('../../../services/Accounts/User/employee');
const GDrive = require('../../../clients/GoogleDriveClient');
const UserService = require('../../../services/Accounts/User/baseUser');

// Delarations
const Employees = new EmployeeService();
const Drive = new GDrive();
const User = new UserService();

// node module
const fs = require('fs');
const path = require('path');
const deleteFile = require('../../../utils/tools/deleteFile');

exports.create = async (req, res, next) => {
  try {
    // create folder in google drive
    const firstName = req.body['details.firstName.en'];
    const mainPhone = req.body['contact.mainPhone.phone'];
    const folderName = `${firstName}-${mainPhone}`;
    const parent = '1Fjo2zDBfSZUY4POsQdpjNzVq99QzqODV';
    const data = await Drive.createFolder(folderName, parent);
    const folderId = data.data.id;

    // upload files in the recently created folder
    const uploadedFiles = [];
    // Loop through all files in req.files
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

exports.get = async (req, res, next) => {
  try {
    const result = await Employees.get(req.query);
    res.status(200).send({ success: true, count: result.length, body: result });
  } catch (err) {
    next(err);
  }
};

// Update User by Id
exports.updateById = async (req, res, next) => {
  try {
    const oldUser = await User.getById(req.params.id);
    const newUser = req.body;
    console.log(oldUser);
    console.log(req);
    let changes = {};
    // Check for changes in 'id' array
    if (JSON.stringify(oldUser['employeeData.id']) !== JSON.stringify(newUser['employeeData.id'])) {
      changes.id = {
        old: oldUser['employeeData.id'],
      };
    }
    // Check for changes in 'photo'
    if (oldUser['employeeData.photo'] !== newUser['employeeData.photo']) {
      changes.photo = {
        old: oldUser['employeeData.photo'],
      };
    }
    if (changes.id) {
      // Delete old 'id' files
      changes.id.old.forEach((file) => {
        
          Drive.deleteFile(file);
        
      });
    }

    if (changes.photo) {
      // Delete old 'photo' file
      Drive.deleteFile(changes.photo.old);
    }
    // when deleting the file
    let deletingFile = req.body['$unset'];
    for (let key in deletingFile) {
      let file = deletingFile[key];
      let pathOfFile = path.join(__dirname, `../../../upload/${file}`);
      deleteFile(pathOfFile);
    }

    /*
    updating the user documents
    */
    if (req.files) {
      let res = await Employees.getById(req.params.id);
      let employeeOldData = res.employeeData;

      // updating only front id and deleting the old file
      if (req.files.nationalIdFront) {
        let filePath = path.join(__dirname, `../../../upload/${employeeOldData.nationalId.front}`);
        deleteFile(filePath);
        req.body = { ...req.body, 'employeeData.nationalId.front': req.files.nationalIdFront[0].filename };
      }
      Drive.deleteFile(employeeOldData.nationalId.back);
      if (req.files.nationalIdBack) {
        req.body = { ...req.body, 'employeeData.nationalId.back': req.files.nationalIdBack[0].filename };
      }
    }
    console.log(req.body);  
    const result = await Employees.updateById(req.params.id, req.body);
    res.status(200).send({ success: true, message: 'User Updated Successfully', body: result });
  } catch (err) {
    next(err);
  }
};
// Update User by Id
exports.getFileByName = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, `../../../upload/${filename}`);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.message.includes('no such file or directory')) {
          return next(new Error('File not found.'));
        }
        return next(err);
      }

      const ext = path.extname(filename).toLowerCase();
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          res.set('Content-Type', 'image/jpeg');
          break;
        case '.png':
          res.set('Content-Type', 'image/png');
          break;
        case '.gif':
          res.set('Content-Type', 'image/gif');
          break;
        case '.pdf':
          res.set('Content-Type', 'application/pdf');
          break;
        case '.doc':
          res.set('Content-Type', 'application/msword');
          break;
        case '.docx':
          res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          break;
        default:
          res.set('Content-Type', 'application/octet-stream');
          break;
      }
      res.status(200).send(data);
    });
  } catch (err) {
    next(err);
  }
};
