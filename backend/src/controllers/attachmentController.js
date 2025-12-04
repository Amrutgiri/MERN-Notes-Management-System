// src/controllers/attachmentController.js
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import Note from "../models/Note.js";

export const uploadAndAttachToNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "No files uploaded" });
    }

    // ensure note exists & belongs to user
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return res.status(404).json({ msg: "Note not found" });

    const attachments = [];

    for (const file of req.files) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: "mern_notes",
        resource_type: "auto",
      });

      // remove temp file
      try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }

      const att = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id.split("/").pop(),
        filename: file.originalname,
        uploadedAt: new Date()
      };

      attachments.push(att);
    }

    // push attachments into note and save
    note.attachments = note.attachments.concat(attachments);
    await note.save();

    res.status(200).json({ note });
  } catch (err) {
    console.error("uploadAndAttachToNote error:", err);
    res.status(err.http_code || 500).json({ msg: err.message || "Server error" });
  }
};
