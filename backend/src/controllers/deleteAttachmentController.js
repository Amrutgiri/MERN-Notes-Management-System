// src/controllers/deleteAttachmentController.js
import cloudinary from "../config/cloudinary.js";
import Note from "../models/Note.js";

export const deleteAttachment = async (req, res) => {
  try {
    const { noteId } = req.params;
   const publicId = req.params.publicId;
    const userId = req.user.id;

    if (!publicId) {
      return res.status(400).json({ msg: "Missing publicId" });
    }
    // 1. Find note & verify ownership
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return res.status(404).json({ msg: "Note not found" });

    // 2. Check the attachment exists in the note
    const exists = note.attachments.find((att) => att.public_id === publicId);
    if (!exists) {
      return res.status(404).json({ msg: "Attachment not found in note" });
    }

    // 3. Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // 4. Remove from note
    note.attachments = note.attachments.filter(
      (att) => att.public_id !== publicId
    );
    await note.save();

    res.json({ msg: "Attachment deleted", note });
  } catch (err) {
    console.error("Delete attachment error:", err);
    res.status(500).json({ msg: err.message });
  }
};
