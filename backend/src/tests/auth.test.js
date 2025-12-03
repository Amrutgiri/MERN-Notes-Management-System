/**
 * @jest-environment node
 */
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";

describe("Auth API", () => {
  const userPayload = { name: "Test", email: "test@example.com", password: "password123" };

  test("POST /api/auth/register - registers a user", async () => {
    const res = await request(app).post("/api/auth/register").send(userPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", userPayload.email);
    expect(res.body).toHaveProperty("access");
    expect(res.body).toHaveProperty("refresh");

    // Ensure passwordHash is not returned
    expect(res.body.user).not.toHaveProperty("passwordHash");
    // Ensure user exists in DB
    const u = await User.findOne({ email: userPayload.email });
    expect(u).not.toBeNull();
  });

  test("POST /api/auth/login - logs in an existing user", async () => {
    // First register
    await request(app).post("/api/auth/register").send(userPayload);

    const res = await request(app).post("/api/auth/login").send({
      email: userPayload.email,
      password: userPayload.password
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("access");
    expect(res.body).toHaveProperty("refresh");
    expect(res.body.user.email).toBe(userPayload.email);
  });

  test("POST /api/auth/login - wrong password returns 400", async () => {
    await request(app).post("/api/auth/register").send(userPayload);

    const res = await request(app).post("/api/auth/login").send({
      email: userPayload.email,
      password: "wrongpass"
    });

    expect(res.statusCode).toBe(400);
  });
});
