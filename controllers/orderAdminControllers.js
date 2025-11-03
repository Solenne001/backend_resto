import * as OrderModel from "../models/orderAdmin.js";

// 🔹 Toutes les commandes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.getAllOrders();
    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("❌ getAllOrders:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// 🔹 Détails d'une commande
export const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.getOrderDetails(orderId);
    if (!order)
      return res.status(404).json({ success: false, message: "Commande introuvable" });

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("❌ getOrderDetails:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// 🔹 Marquer une commande "Reçue" et notifier le client
export const markOrderReceived = async (req, res) => {
  try {
    const orderId = req.params.id;

    // ✅ Toujours mettre un statut même si on affiche plus
    const updatedOrder = await OrderModel.updateOrderStatus(orderId, "Reçue");
    if (!updatedOrder)
      return res.status(404).json({ success: false, message: "Commande introuvable" });

    const tableNumber =
      updatedOrder.client_table ||
      updatedOrder.order_table ||
      updatedOrder.table_number;

    if (req.io && tableNumber) {
      req.io.to(`table_${tableNumber}`).emit("order_received", {
        message: `✅ Votre commande #${orderId} est bien reçue`,
      });
    }

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("❌ markOrderReceived:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

//delete d'un mois 
export const deletePreviousMonth = async (req, res) => {
  try {
    const deletedCount = await OrderModel.deletePreviousMonthOrders();
    res.status(200).json({
      success: true,
      message: `${deletedCount} commandes supprimées ✅`,
      deletedCount,
    });
  } catch (err) {
    console.error("❌ deletePreviousMonth:", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression",
    });
  }
};
