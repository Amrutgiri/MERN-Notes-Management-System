import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "Untitled" },
    body: { type: String, default: "" },
    isTrashed: { type: Boolean, default: false },
    attachments: [
      {
        url: String,
        public_id: String,
        filename: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },

  { timestamps: true }
);

NoteSchema.index({ title: "text", body: "text" });

export default mongoose.model("Note", NoteSchema);
