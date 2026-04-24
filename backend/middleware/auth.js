const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "pawcruz_dev_secret";

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const id = decoded.id || decoded.userId;
    const role = decoded.role;

    if (!id || !role) {
      return res.status(401).json({ message: "Token payload invalid" });
    }

    req.user = {
      ...decoded,
      id,
      role,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

exports.authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
