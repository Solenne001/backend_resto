// import db from "../config/db.js";

// Récupérer tous les plats
export const getAllMenuItems = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM menus"); 
    res.json(rows);
  } catch (error) {
    console.error("Erreur getAllMenuItems :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Ajouter un plat
export const addMenuItem = async (name, price, description, photo, category, restaurant_id = 1) => {
  const [result] = await db.execute(
    "INSERT INTO menus (restaurant_id, name, description, price, photo, category, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
    [restaurant_id, name, description, price, photo, category]
  );
  return result;
};

// Modifier un plat
export const updateMenuItem = async (id, name, price, description, photo, category) => {
  const [result] = await db.execute(
    "UPDATE menus SET name = ?, description = ?, price = ?, photo = ?, category = ? WHERE id = ?",
    [name, description, price, photo, category, id]
  );
  return result;
};

// Supprimer un plat
export const deleteMenuItem = async (id) => {
  const [result] = await db.execute("DELETE FROM menus WHERE id = ?", [id]);
  return result;
};
