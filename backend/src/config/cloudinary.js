// src/config/cloudinary.js
import dotenv from "dotenv";
dotenv.config(); // safe to call again

import { v2 as cloudinary } from "cloudinary";

// read and trim env values
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const API_KEY = process.env.CLOUDINARY_API_KEY?.trim();
const API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();

console.log("Cloudinary ENV Loaded:", {
  cloud_name: CLOUD_NAME ? "OK" : "MISSING",
  api_key: API_KEY ? `OK (len=${API_KEY.length})` : "MISSING",
  api_secret: API_SECRET ? `OK (len=${API_SECRET.length})` : "MISSING",
});

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

export default cloudinary;
