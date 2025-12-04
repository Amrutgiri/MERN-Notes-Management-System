// src/app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import noteAttachmentRoutes from "./routes/noteAttachmentRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/notes", noteAttachmentRoutes);

export default app;
