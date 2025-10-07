// controllers/orderControllers.js
import * as Order from "../models/orders.js";

// 👉 Créer une commande
export const createOrder = async (req, res) => {
  try {
    const { clientId, dishes } = req.body;

    // Vérif si les données sont présentes
    if (!clientId || !dishes || !Array.isArray(dishes) || !dishes.length) {
      return res.status(400).json({
        success: false,
        message: "Client et plats requis"
      });
    }

    const order = await Order.createOrder({ clientId, dishes });

    res.status(201).json({
      success: true,
      message: "Commande créée avec succès",
      order
    });
  } catch (err) {
    console.error("❌ Erreur createOrder:", err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création de la commande",
      error: err.message
    });
  }
};

// 👉 Récupérer toutes les commandes (admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.getOrders();
    res.status(200).json({
      success: true,
      orders
    });
  } catch (err) {
    console.error("❌ Erreur getOrders:", err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des commandes",
      error: err.message
    });
  }
};

// 👉 Mettre à jour le statut d’une commande
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Statut requis"
      });
    }

    const updatedOrder = await Order.updateOrderStatus(orderId, status);

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Commande introuvable"
      });
    }

    res.status(200).json({
      success: true,
      message: "Statut mis à jour",
      order: updatedOrder
    });
  } catch (err) {
    console.error("❌ Erreur updateOrderStatus:", err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour du statut",
      error: err.message
    });
  }
};
