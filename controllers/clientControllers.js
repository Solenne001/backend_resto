// server/controllers/clientControllers.js
import * as ClientModel from "../models/client.js";
import * as OrderModel from "../models/orders.js"; // Assurez-vous que OrderModel fonctionne pour MySQL

// Créer un client + commande initiale
export const createClient = async (req, res) => {
  try {
    const { name, table_number, type } = req.body;

    // Validation
    if (!type || (type === "restaurant" && (!table_number || table_number.trim() === "")) ||
        (type === "emporter" && (!name || name.trim() === ""))) {
      return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
    }

    // Créer le client
    const client = await ClientModel.createClient({
      name: type === "emporter" ? name.trim() : null,
      table_number: type === "restaurant" ? table_number.trim() : null,
      type,
    });

    // Créer commande initiale vide
    const order = await OrderModel.createOrder({ clientId: client.id, dishes: [] });

    res.status(201).json({
      success: true,
      client,
      order,
      message: "Client et commande créés avec succès",
    });

  } catch (err) {
    console.error("❌ createClient:", err);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};

// Récupérer tous les clients
export const getClients = async (req, res) => {
  try {
    const clients = await ClientModel.getClients();
    res.status(200).json({ success: true, clients });
  } catch (err) {
    console.error("❌ getClients:", err);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};
