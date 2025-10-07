import express from "express";
import { getAllOrders, getOrderDetails, markOrderReceived } from "../controllers/orderAdminControllers.js";

const router = express.Router();

// 🔹 Toutes commandes
router.get("/", getAllOrders);

// 🔹 Une commande
router.get("/:id", getOrderDetails);

// 🔹 Marquer une commande "Reçue"
router.put("/received/:id", markOrderReceived);

export default router;
