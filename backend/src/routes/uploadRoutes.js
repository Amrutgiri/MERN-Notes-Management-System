import express from "express";
import upload from "../middleware/upload.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { uploadFiles } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/", requireAuth, upload.array("files"), uploadFiles);


export default router;
