import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: process.env.CLOUDINARY_FOLDER || 'Epicode', 
    format: async (req, file) => {
      const allowedFormats = ['jpeg', 'png', 'jpg'];
      const extension = file.mimetype.split('/')[1];
      return allowedFormats.includes(extension) ? extension : 'jpeg';
    },
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `${originalName}-${timestamp}`;
    },
    transformation: [{ width: 500, height: 500, crop: 'limit' }], 
  },
});

const upload = multer({ storage });

export default upload;
