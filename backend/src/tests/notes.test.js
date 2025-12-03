/**
 * @jest-environment node
 */
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import Note from "../models/Note.js";

describe("Notes API", () => {
  let accessToken;
  let userId;

  beforeEach(async () => {
    // create user and login to get access token
    const userRes = await request(app).post("/api/auth/register").send({
      name: "NoteUser",
      email: "noteuser@example.com",
      password: "pass123"
    });

    accessToken = userRes.body.access;
    userId = userRes.body.user._id;
  });

  test("POST /api/notes - create a new note", async () => {
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Test Note", body: "This is a test." });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Test Note");

    const dbNote = await Note.findOne({ _id: res.body._id });
    expect(dbNote).not.toBeNull();
    expect(String(dbNote.userId)).toBe(String(userId));
  });

  test("GET /api/notes - returns notes for user", async () => {
    // create two notes
    await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "A", body: "a" });

    await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "B", body: "b" });

    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test("PUT /api/notes/:id - updates a note", async () => {
    const createRes = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "ToUpdate", body: "old" });

    const noteId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Updated", body: "new" });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.title).toBe("Updated");

    const db = await Note.findById(noteId);
    expect(db.title).toBe("Updated");
  });

  test("DELETE /api/notes/:id - soft deletes note", async () => {
    const createRes = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "TrashMe", body: "bye" });

    const noteId = createRes.body._id;

    const delRes = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(delRes.statusCode).toBe(200);
    expect(delRes.body).toHaveProperty("msg");

    const db = await Note.findById(noteId);
    expect(db.isTrashed).toBe(true);
  });
});
