import { db } from "../config/db.js";

export const createOrder = async ({ clientId, dishes }) => {
  const [orderResult] = await db.query(
    "INSERT INTO orders (client_id, status) VALUES (?,?)",
    [clientId, "en attente"]
  );
  const orderId = orderResult.insertId;

  for (const d of dishes) {
    await db.query(
      "INSERT INTO order_items (order_id, menu_id, quantity) VALUES (?,?,?)",
      [orderId, d.dishId, d.quantity || 1]
    );
  }

  return { orderId, clientId, dishes, status: "en attente" };
};

export const getOrders = async () => {
  const [orders] = await db.query(`
    SELECT o.*, c.name AS client_name, c.table_number, c.type
    FROM orders o
    JOIN clients c ON c.id = o.client_id
    ORDER BY o.created_at DESC
  `);

  for (const order of orders) {
    const [items] = await db.query(
      "SELECT oi.*, m.name, m.price FROM order_items oi JOIN menus m ON m.id = oi.menu_id WHERE oi.order_id=?",
      [order.id]
    );
    order.dishes = items;
  }

  return orders;
};

export const updateOrderStatus = async (orderId, status) => {
  await db.query("UPDATE orders SET status=? WHERE id=?", [status, orderId]);
  const [rows] = await db.query("SELECT * FROM orders WHERE id=?", [orderId]);
  return rows[0];
};
