import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadFiles = async (req, res) => {
  try {
    console.log(req.files);  // debug

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "No files uploaded" });
    }

    const uploads = [];

    for (const file of req.files) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: "mern_notes",
        resource_type: "auto",
      });

      // Delete temporary file
      fs.unlinkSync(file.path);

      uploads.push({
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        filename: file.originalname,
      });
    }

    res.status(201).json({ files: uploads });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ msg: err.message });
  }
};