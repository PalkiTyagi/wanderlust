
import dotenv from "dotenv";
dotenv.config();

import cloudinary from "cloudinary";
import CloudinaryStorage from "multer-storage-cloudinary";

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

// config
cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

// storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // 🔥 IMPORTANT FIX
  params: {
    folder: "wanderlust_DEV",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export { cloudinary, storage };