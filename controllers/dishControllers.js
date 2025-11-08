// server/controllers/dishControllers.js
import db from "../config/db.js";

// --------------------- Récupérer tous les plats ---------------------
export const getDishes = async (req, res) => {
  try {
    const [dishes] = await db.query("SELECT * FROM menus ORDER BY id DESC");
    res.status(200).json({ success: true, dishes });
  } catch (err) {
    console.error("❌ getDishes:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// --------------------- Ajouter un plat ---------------------
export const createDish = async (req, res) => {
  try {
    const { name, price, description, photo } = req.body; // photo partout
    const [result] = await db.query(
      "INSERT INTO menus (name, price, description, photo) VALUES (?, ?, ?, ?)",
      [name, price, description, photo]
    );

    res.status(201).json({
      success: true,
      dish: { id: result.insertId, name, price, description, photo },
    });
  } catch (err) {
    console.error("❌ createDish:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// --------------------- Modifier un plat ---------------------
export const updateDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const { name, price, description, photo } = req.body; // photo partout
    const [result] = await db.query(
      "UPDATE menus SET name=?, price=?, description=?, photo=? WHERE id=?",
      [name, price, description, photo, dishId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Plat introuvable" });

    res.status(200).json({
      success: true,
      dish: { id: dishId, name, price, description, photo },
    });
  } catch (err) {
    console.error("❌ updateDish:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// --------------------- Supprimer un plat ---------------------
export const deleteDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const [result] = await db.query("DELETE FROM menus WHERE id=?", [dishId]);

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Plat introuvable" });

    res.status(200).json({ success: true, message: "Plat supprimé" });
  } catch (err) {
    console.error("❌ deleteDish:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
