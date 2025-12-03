// src/tests/setup.js
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

beforeAll(async () => {
  // provide test secrets if your code expects them
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test_refresh_secret";

  // optional: avoid strictQuery deprecation noise
  mongoose.set("strictQuery", false);

  // start in-memory mongo
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // NOTE: do NOT pass useNewUrlParser/useUnifiedTopology — modern mongoose ignores them
  await mongoose.connect(uri);
});

afterEach(async () => {
  // clear collections between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});
