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

app.use(
  cors({
    origin: [
      "https://menuqr-alpha.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Servir les images uploadées
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// --------------------- SOCKET.IO --------------------- //
const io = new Server(server, {
  cors: {
    origin: [
      "https://menuqr-alpha.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  },
});

// Injecter l’instance socket dans les routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --------------------- SOCKET CONNECTION --------------------- //
io.on("connection", (socket) => {
  console.log("✅ Client connecté :", socket.id);

  socket.on("joinClient", (tableIdentifier) => {
    if (!tableIdentifier) return;

    const normalizedId = String(tableIdentifier).trim().toLowerCase();
    socket.join(`table_${normalizedId}`);

    console.log(`📌 Client rejoint → table_${normalizedId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client déconnecté :", socket.id);
  });
});

// --------------------- ROUTES --------------------- //
// Client
app.use("/api/client", clientRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);

// Admin
app.use("/api/admin/orders", orderAdminRoutes);
app.use("/api/admin/sales", salesRoutes);
app.use("/api/admin/menu", menuRoutes);

// Auth + QR
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/qrs", qrRoutes);

// --------------------- ADMIN : "COMMANDE REÇUE" --------------------- //
app.put("/api/admin/orders/:orderId/received", async (req, res) => {
  const { orderId } = req.params;
  const { tableNumber } = req.body;

  if (!tableNumber) {
    return res.status(400).json({
      success: false,
      message: "Identifiant de table manquant",
    });
  }

  try {
    const normalizedId = String(tableNumber).trim().toLowerCase();

    const updatedOrder = {
      id: orderId,
      order_table: tableNumber,
      status: "Reçue",
    };

    io.to(`table_${normalizedId}`).emit("order_received", {
      message: `✅ Votre commande #${orderId} a été reçue !`,
      order: updatedOrder,
    });

    res.json({
      success: true,
      order: updatedOrder,
      message: `Notification envoyée à la table ${tableNumber}`,
    });
  } catch (err) {
    console.error("❌ Erreur lors de la notification :", err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// --------------------- TEST NOTIF GLOBALE --------------------- //
app.get("/api/test-notification-all", (req, res) => {
  io.emit("order_received", {
    message: "📢 Test de notification globale 🚀",
  });

  res.json({
    success: true,
    message: "Notification envoyée à tous les clients ✅",
  });
});

// --------------------- START SERVER --------------------- //
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Serveur lancé sur le port ${PORT}`)
);
