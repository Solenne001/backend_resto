import express from "express";
import { getOrders, createOrder, updateOrderStatus } from "../controllers/orderControllers.js";

const router = express.Router();

router.get("/", getOrders);                     // Récupérer toutes les commandes
router.post("/create", createOrder);           // Créer une commande
router.put("/status/:orderId", updateOrderStatus); // Mettre à jour le statut

export default router;
