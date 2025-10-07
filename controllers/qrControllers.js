import { QrModel } from "../models/qr.js";

export const QrController = {
  async getAll(req, res) {
    try {
      const qrs = await QrModel.getAll();
      res.json({ success: true, qrs });
    } catch (err) {
      console.error("❌ Erreur getAll:", err);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async create(req, res) {
    try {
      const { tableNumber, qrUrl } = req.body;
      if (!tableNumber || !qrUrl)
        return res.status(400).json({ success: false, message: "Champs manquants" });

      const existing = await QrModel.getByTableNumber(tableNumber);
      if (existing)
        return res.status(400).json({ success: false, message: "Ce numéro de table existe déjà" });

      const qr = await QrModel.create(tableNumber, qrUrl);
      res.json({ success: true, qr });
    } catch (err) {
      console.error("❌ Erreur create:", err);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await QrModel.delete(id);
      res.json({ success: true, message: "QR supprimé" });
    } catch (err) {
      console.error("❌ Erreur delete:", err);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
};
