import Note from "../models/Note.js";

export const createNote = async (req, res) => {
  const note = await Note.create({ userId: req.user.id, ...req.body });
  res.status(201).json(note);
};


export const getNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.user.id, isTrashed: false });
  res.json(notes);
};


export const updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(note);
};

export const deleteNote = async (req, res) => {
  await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { isTrashed: true }
  );
  res.json({ msg: "Moved to trash" });
};


export const addAttachmentToNote = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

  if (!note) return res.status(404).json({ msg: "Note not found" });

  const files = req.body.files; // pass URLs from frontend

  note.attachments.push(...files);
  await note.save();

  res.json(note);
};