import db from "../config/db.js";

// 🔹 Récupérer tous les plats
export const getAllMenuItems = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM menus ORDER BY created_at DESC");
    res.json({ success: true, menus: rows });
  } catch (error) {
    console.error("❌ getAllMenuItems:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// 🔹 Ajouter un plat (avec image)
export const addMenuItem = async (req, res) => {
  const { restaurant_id, name, description, price, category } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await db.query(
      "INSERT INTO menus (restaurant_id, name, description, price, photo, category, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [restaurant_id, name, description, price, photo, category]
    );

    res.status(201).json({
      success: true,
      menu: { id: result.insertId, restaurant_id, name, description, price, photo, category },
    });
  } catch (error) {
    console.error("❌ addMenuItem:", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error });
  }
};

// 🔹 Modifier un plat (avec image)
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    // Si aucune nouvelle image, ne pas écraser l'ancienne
    let query, params;
    if (photo) {
      query = "UPDATE menus SET name=?, description=?, price=?, category=?, photo=? WHERE id=?";
      params = [name, description, price, category, photo, id];
    } else {
      query = "UPDATE menus SET name=?, description=?, price=?, category=? WHERE id=?";
      params = [name, description, price, category, id];
    }

    await db.query(query, params);
    res.json({ success: true, message: "Plat mis à jour avec succès" });
  } catch (error) {
    console.error("❌ Erreur updateMenuItem :", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error });
  }
};

// 🔹 Supprimer un plat
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM menus WHERE id=?", [id]);
    res.json({ success: true, message: "Plat supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur deleteMenuItem :", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error });
  }
};
