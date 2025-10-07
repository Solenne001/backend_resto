import db from "../config/db.js"; // ⚠️ adapte le chemin si besoin

// ➤ Récupérer tous les plats
export const getDishes = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM menus ORDER BY created_at DESC");
    return rows;
  } catch (err) {
    console.error("❌ getDishes error:", err);
    throw err;
  }
};

// ➤ Créer un nouveau plat
export const createDish = async ({ restaurant_id, name, description, price, photo, category }) => {
  try {
    const [result] = await db.query(
      "INSERT INTO menus (restaurant_id, name, description, price, photo, category, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [restaurant_id, name, description, price, photo, category]
    );
    return { id: result.insertId, restaurant_id, name, description, price, photo, category };
  } catch (err) {
    console.error("❌ createDish error:", err);
    throw err;
  }
};

// ➤ Mettre à jour un plat
export const updateDish = async (dishId, data) => {
  try {
    const { name, description, price, photo, category } = data;
    await db.query(
      "UPDATE menus SET name=?, description=?, price=?, photo=?, category=? WHERE id=?",
      [name, description, price, photo, category, dishId]
    );
    const [rows] = await db.query("SELECT * FROM menus WHERE id=?", [dishId]);
    return rows[0];
  } catch (err) {
    console.error("❌ updateDish error:", err);
    throw err;
  }
};

// ➤ Supprimer un plat
export const deleteDish = async (dishId) => {
  try {
    await db.query("DELETE FROM menus WHERE id=?", [dishId]);
    return { success: true };
  } catch (err) {
    console.error("❌ deleteDish error:", err);
    throw err;
  }
};
