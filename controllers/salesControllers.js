import * as SalesModel from "../models/sales.js";

// Résumé quotidien
export const getDailySummary = async (req, res) => {
  try {
    const summary = await SalesModel.getDailySummary();
    res.status(200).json({ success: true, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Plat le plus vendu
export const getTopSellingDish = async (req, res) => {
  try {
    const topDish = await SalesModel.getTopSellingDish();
    res.status(200).json({ success: true, topDish });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
