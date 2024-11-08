const multer = require("multer")
const cloudinary = require('cloudinary').v2;
require('dotenv').config()
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png']
  }
});

const cloudinaryUpload = multer({ storage: cloudinaryStorage })

module.exports = {cloudinaryUpload}