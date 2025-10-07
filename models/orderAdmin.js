import { db } from "../config/db.js";

// 🔹 Toutes les commandes avec items
export const getAllOrders = async () => {
  try {
    const [orders] = await db.execute(
      `SELECT 
        o.id, 
        o.status, 
        o.table_number AS order_table,
        o.created_at,
        c.name AS client_name,
        c.table_number AS client_table
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      ORDER BY o.created_at DESC`
    );

    if (orders.length === 0) return [];

    const orderIds = orders.map(o => o.id);

    const [items] = await db.execute(
      `SELECT 
        oi.order_id, 
        m.name AS dish_name, 
        m.price, 
        oi.quantity
      FROM order_items oi
      JOIN menus m ON oi.menu_id = m.id
      WHERE oi.order_id IN (${orderIds.map(() => "?").join(",")})`,
      orderIds
    );

    // 🔹 Ajouter les items à chaque commande
    const itemsByOrder = {};
    orders.forEach(o => itemsByOrder[o.id] = []);
    items.forEach(item => {
      itemsByOrder[item.order_id].push({
        dish_name: item.dish_name,
        price: item.price,
        quantity: item.quantity
      });
    });

    // 🔹 Retourner seulement les commandes avec items
    return orders.map(o => ({
      ...o,
      items: itemsByOrder[o.id]
    })).filter(o => o.items.length > 0); // ⚡ filtrer les commandes vides
  } catch (err) {
    console.error("❌ getAllOrders:", err);
    throw err;
  }
};

// 🔹 Une seule commande
export const getOrderDetails = async (orderId) => {
  try {
    const [[order]] = await db.execute(
      `SELECT 
        o.id, 
        o.status, 
        o.table_number AS order_table,
        o.created_at,
        c.name AS client_name,
        c.table_number AS client_table
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.id = ?`,
      [orderId]
    );
    if (!order) return null;

    const [items] = await db.execute(
      `SELECT oi.order_id, m.name AS dish_name, m.price, oi.quantity
       FROM order_items oi
       JOIN menus m ON oi.menu_id = m.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    order.items = items.map(item => ({
      dish_name: item.dish_name,
      price: item.price,
      quantity: item.quantity
    }));

    return order;
  } catch (err) {
    console.error("❌ getOrderDetails:", err);
    throw err;
  }
};

// 🔹 Mettre à jour le statut
export const updateOrderStatus = async (orderId, status) => {
  try {
    const [result] = await db.execute(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId]
    );
    if (result.affectedRows === 0) return null;
    return await getOrderDetails(orderId);
  } catch (err) {
    console.error("❌ updateOrderStatus:", err);
    throw err;
  }
};
