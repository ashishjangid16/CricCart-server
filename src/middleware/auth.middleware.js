import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token, unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id || decoded.id || decoded.userId;

    if (!userId) return res.status(401).json({ message: "Invalid token" });

    req.user = { ...decoded, _id: userId };

    next();
  } catch (err) {
    res.status(401).json({
      message: err.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Invalid token. Please log in again.",
    });
  }
};
