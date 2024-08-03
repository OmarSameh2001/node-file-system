const multer = require('multer');
const path = require('path');
const { format } = require('date-fns');
const fs = require('fs');

class MulterClient {
  // initialize date and base local path (could be changed to aws)
  constructor(basePath = './upload/') {
    this.date = format(new Date(Date.now()), 'yyyy-MM-dd_HH.mm.ss').toString();
    this.basePath = basePath;
  }

  // define file filter (multer options) 
  // (ex: only images, pdf, docx, ...etc)(application/pdf)
  fileFilter = (filters) => {
    return (req, file, cb) => {
      // Check if the file's MIME type matches any of the filters
      const matches = filters.some(filter => file.mimetype.startsWith(filter));
  
      if (matches) {
        cb(null, true);
      } else {
        const expectedTypes = filters.join(', ');
        cb(new Error(`File type ${file.mimetype} does not match any of the expected types: ${expectedTypes}`), false);
      }
    };
  };
  

  // define storage config (multer options)
  // (ex: dynamic path: ./uploads/employees/:id/images/)(dynamic id needs new user id field deifferent from mongo index (_id))
  // (ex: filename: 2024-07-14_16.17.19-ImageName.jpg)
  storageConfig(filePath) {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        const dir = path.join(this.basePath, filePath);
        
        // Check if directory exists, if not, create it
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
  
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        cb(null, this.date + '-' + file.originalname);
      }
    });
  }

  // the main module
  // can have dynamic filters, path, and fields
  upload(filePath, fields, filter) {
    const storage = this.storageConfig(filePath);
    const fileFilter = this.fileFilter(filter);

    return multer({ storage: storage, fileFilter: fileFilter }).fields(fields);
  }
}

module.exports = MulterClient;