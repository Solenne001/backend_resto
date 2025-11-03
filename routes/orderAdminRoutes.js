import express from "express";
import { getAllOrders, getOrderDetails, markOrderReceived , deletePreviousMonth} from "../controllers/orderAdminControllers.js";

const router = express.Router();

// 🔹 Toutes commandes
router.get("/", getAllOrders);

// 🔹 Une commande
router.get("/:id", getOrderDetails);

// 🔹 Marquer une commande "Reçue"
router.put("/received/:id", markOrderReceived);
//delete d'un mois
router.delete("/clear-previous-month", deletePreviousMonth);

export default router;
