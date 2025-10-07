import express from "express";
import { createClient, getClients } from "../controllers/clientControllers.js";

const router = express.Router();

router.post("/create", createClient);  // Créer un client + commande initiale
router.get("/", getClients);           // Récupérer tous les clients

export default router;
