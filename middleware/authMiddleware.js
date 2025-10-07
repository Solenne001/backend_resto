import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // format Bearer <token>
  if (!token) return res.status(403).json({ message: "Accès interdit" });

  jwt.verify(token, process.env.JWT_SECRET || "supersecret", (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = user;
    next();
  });
};
