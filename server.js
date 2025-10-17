// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// --------------------- IMPORT DES ROUTES --------------------- //
// Routes client
import clientRoutes from "./routes/clientRoutes.js";
import dishRoutes from "./routes/dishRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Routes admin
import orderAdminRoutes from "./routes/orderAdminRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import menuRoutes from "./routes/menuManagementRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";

// --------------------- CONFIGURATION --------------------- //
dotenv.config();

const app = express();
const server = http.createServer(app);

// --------------------- MIDDLEWARE --------------------- //
app.use(express.json());

// CORS : autoriser le front local + le front hébergé (Vercel)
app.use(cors({
  origin: [
    "https://menuqr-alpha.vercel.app", // ton front en production
    "http://localhost:3000"            // ton front en local
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Servir les fichiers statiques (ex : images uploadées)
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// --------------------- SOCKET.IO --------------------- //
const io = new Server(server, {
  cors: {
    origin: [
      "https://menuqr-alpha.vercel.app",
      "http://localhost:3000"
    ],
    credentials: true
  },
});

// Injecter `io` dans chaque requête pour pouvoir l’utiliser dans les routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connexions Socket.io
io.on("connection", (socket) => {
  console.log("✅ Client connecté :", socket.id);

  // Le client rejoint une room selon son identifiant (numéro ou nom de table)
  socket.on("joinClient", (tableIdentifier) => {
    if (!tableIdentifier) return;

    const normalizedId = String(tableIdentifier).trim().toLowerCase();
    socket.join(`table_${normalizedId}`);

    console.log(`📌 Client "${tableIdentifier}" a rejoint la room (${normalizedId})`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client déconnecté :", socket.id);
  });
});

// --------------------- ROUTES --------------------- //
// Routes client
app.use("/api/client", clientRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);

// Routes admin
app.use("/api/admin/orders", orderAdminRoutes);
app.use("/api/admin/sales", salesRoutes);
app.use("/api/admin/menu", menuRoutes);

// Routes d’authentification et QR
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/qrs", qrRoutes);

// --------------------- NOTIFICATION : COMMANDE REÇUE --------------------- //
app.put("/api/admin/orders/:orderId/received", async (req, res) => {
  const { orderId } = req.params;
  const { tableNumber } = req.body;

  if (!tableNumber) {
    return res.status(400).json({ success: false, message: "Identifiant de table manquant" });
  }

  try {
    const normalizedId = String(tableNumber).trim().toLowerCase();

    const updatedOrder = { id: orderId, order_table: tableNumber, status: "Reçue" };

    // 🔔 Envoi d’une notification au client concerné
    io.to(`table_${normalizedId}`).emit("new_order", {
      message: `✅ Votre commande #${orderId} a été reçue !`,
    });

    res.json({
      success: true,
      order: updatedOrder,
      message: `Notification envoyée à la table ${tableNumber}`,
    });
  } catch (err) {
    console.error("❌ Erreur lors de la notification :", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// --------------------- TEST : NOTIFICATION GLOBALE --------------------- //
app.get("/api/test-notification-all", (req, res) => {
  const fakeOrder = {
    id: Math.floor(Math.random() * 1000),
    order_table: "ALL",
    status: "TEST_NOTIFICATION 🚀",
  };

  io.emit("order:status-changed", fakeOrder);

  res.json({
    success: true,
    message: "Notification envoyée à tous les clients connectés ✅",
  });
});

// --------------------- LANCEMENT DU SERVEUR --------------------- //
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
