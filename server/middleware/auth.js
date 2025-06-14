import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    console.log("Auth middleware triggered");
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    // console.log("Decoded user:", decoded);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isTailor = (req, res, next) => {
  if (req.userRole !== "tailor") {
    return res.status(403).json({ message: "Access denied. Tailors only." });
  }
  next();
};
