import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const fs = require('fs');

import dotenv from "dotenv";

dotenv.config();

// add your credentials in .env
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

class DriveClient {
  // initialize authentication
  constructor() {
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.date = Date.now();
  }
  async uploadFile(file, user) {
    const fileBuffer = fs.createReadStream(file.path);
    const fileName = `${user}-${file.originalname}-${this.date}`;
    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: file.mimetype,
    };

    try {
        await this.s3Client.send(new PutObjectCommand(uploadParams));
        const fileUrl = `https://${bucketName}.s3.amazonaws.com/${encodeURIComponent(fileName)}`;
        return fileUrl;
      } catch (err) {
        console.error('Error uploading file:', err);
        throw err;
      }
  }
  deleteFile(fileName) {
    const deleteParams = {
      Bucket: bucketName,
      Key: fileName,
    };

    return this.s3Client.send(new DeleteObjectCommand(deleteParams));
  }
}

module.exports = DriveClient;