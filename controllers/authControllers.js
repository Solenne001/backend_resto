import jwt from "jsonwebtoken";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "123456"; // mot de passe admin
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // secret pour JWT

export const login = (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ success: false, message: "Code requis" });
  if (code !== ADMIN_SECRET) return res.status(401).json({ success: false, message: "Code invalide" });

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });

  res.json({ success: true, token, message: "Connexion réussie ✅" });
};
