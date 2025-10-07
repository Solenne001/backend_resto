// import db from "../config/db.js";

// Résumé quotidien
export const getDailySummary = async () => {
  const [rows] = await db.execute(
    "SELECT COUNT(*) AS total_orders, SUM(total_price) AS total_sales " +
    "FROM orders WHERE DATE(created_at) = CURDATE()"
  );
  return rows[0];
};

// Plat le plus vendu
export const getTopSellingDish = async () => {
  const [rows] = await db.execute(
    "SELECT m.name, SUM(od.quantity) AS total_sold " +
    "FROM order_details od " +
    "JOIN menu m ON od.menu_id = m.id " +
    "GROUP BY od.menu_id " +
    "ORDER BY total_sold DESC LIMIT 1"
  );
  return rows[0];
};
