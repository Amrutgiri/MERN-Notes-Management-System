import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });
    const access = generateAccessToken(user);
    const refresh = generateRefreshToken(user);

    res.status(201).json({ user, access, refresh });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const access = generateAccessToken(user);
  const refresh = generateRefreshToken(user);

  res.json({ user, access, refresh });
};


export const refreshToken = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    const access = generateAccessToken(user);
    res.json({ access });
  } catch (err) {
    res.status(401).json({ msg: "Invalid refresh token" });
  }
};
