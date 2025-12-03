import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ msg: "No token, unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // {id, role}
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
