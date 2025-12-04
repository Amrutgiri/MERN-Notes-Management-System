// src/routes/noteAttachmentRoutes.js
import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { uploadAndAttachToNote } from "../controllers/attachmentController.js";
import { deleteAttachment } from "../controllers/deleteAttachmentController.js";
const router = express.Router();

// POST /api/notes/:id/attachments
router.post("/:id/attachments", requireAuth, upload.array("files"), uploadAndAttachToNote);
router.delete("/:noteId/attachments/:publicId", requireAuth, deleteAttachment);
export default router;
