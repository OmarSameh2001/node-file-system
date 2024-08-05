# Node file system
Files managment system that can be used with local storage or google drive or AWS

the current controllers can upload and delete files only

the ability to update can be handled easily by using delete and upload clients in new controller
## 1- Create AWS or Google API Credentials
#### Google Frive Credentials
Follow the instructions in this [YouTube tutorial](https://www.youtube.com/watch?v=Z2MCxblgPoc) to create and configure your Google Drive API credentials.

Then update credentials in google drive client
#### AWS S3 Credentials
Follow the instructions in this [YouTube tutorial](https://www.youtube.com/watch?v=39X5WdZbEwQ) to create and configure your AWS S3 API credentials.

Then update credentials in AWS client
## 2- Install package.json dependencies
#### Inside terminal
```bash
npm install
```
## 3- Setup MongoDB server
Follow the instructions in this [YouTube tutorial](https://www.youtube.com/watch?v=Tftr5XVsV5U) to setup MongoDB compass server.

Then update mongo url in app.js
## 4- Postman usage
### Upload
#### Form-data
the package used to save files (multer) need the data in the form of Form-data
![Screenshot (289)](https://github.com/user-attachments/assets/660813c5-030d-4875-bbfe-eff99b28cf5f)
### Delete
#### Type the url/id (ex: http://localhost:5000/user/64cc96b827ccf0fa53ab33c1)
