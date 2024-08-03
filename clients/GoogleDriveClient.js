const fs = require('fs');
const { google } = require('googleapis');

class DriveClient {

  // initialize authentication
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: './utils/credintials.json', // change to path of your credentials and its better to put it in .env
      scopes: 'https://www.googleapis.com/auth/drive', // mandatory scope for google drive
    });
  }

  createFile(file, folderId) {
    try {
        const uploadFile = async () => {
            try {
              const fileStream = fs.createReadStream(file.path);
              const drive = google.drive({ version: 'v3', auth: this.auth });
      
              const { data } = await drive.files.create({
                media: {
                  mimeType: file.mimetype,
                  body: fileStream,
                },
                requestBody: {
                  name: file.originalname,
                  parents: [folderId], // parent folder
                },
                fields: 'id,name',
              });
      
              // Close the file stream after upload
              fileStream.close();
              return { id: data.id, name: data.name };
            } catch (err) {
              console.error(err);
            }
          };

      return uploadFile();
    } catch (err) {
      console.error(err);
    }
  }
  createFolder(folderName, parent) {
    try {
      const drive = google.drive({ version: 'v3', auth: this.auth });
      const folder = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parent], // parent folder
      };
      const  data  = drive.files.create({
        resource: folder,
        fields: 'id',
      });

      return data;
    } catch (err) {
      console.error(err);
    }
  }
  deleteFile(fileId) {
    try {
      const drive = google.drive({ version: 'v3', auth: this.auth });
      drive.files.delete({ fileId: fileId });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = DriveClient;
