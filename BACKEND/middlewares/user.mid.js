import jwt from "jsonwebtoken";

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract token properly
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    // Synchronous token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assign userId from decoded token
    req.userId = decoded.id; // Ensure your token payload contains `id`

    next();
  } catch (error) {
    console.error("Invalid token or expired:", error.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

export default userMiddleware;
