import express from "express";
import db from "../config/db.js"; // connexion MySQL

const router = express.Router();

// ➤ Nombre de commandes du jour
router.get("/orders-today", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) as orders FROM orders WHERE DATE(created_at) = CURDATE()"
    );
    res.json({ success: true, orders: rows[0].orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➤ Chiffre d’affaires du jour
router.get("/revenue-today", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT IFNULL(SUM(total_price),0) as revenue FROM orders WHERE DATE(created_at) = CURDATE()"
    );
    res.json({ success: true, revenue: parseFloat(rows[0].revenue) || 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➤ Résumé des ventes par mois
router.get("/monthly", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_price) as totalSales
      FROM orders
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);
    const formatted = rows.map(r => ({
      month: r.month,
      totalSales: parseFloat(r.totalSales) || 0
    }));
    res.json({ success: true, monthlySales: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➤ Top 5 plats vendus
router.get("/top-dishes", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.name, SUM(oi.quantity) as totalSold
      FROM order_items oi
      JOIN menus m ON oi.menu_id = m.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'reçue'
      GROUP BY m.id, m.name
      ORDER BY totalSold DESC
      LIMIT 5
    `);
    const formatted = rows.map(r => ({
      dish: r.name,
      count: parseInt(r.totalSold) || 0
    }));
    res.json({ success: true, topDishes: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➤ Nombre de commandes par jour
router.get("/orders-per-day", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as totalOrders
      FROM orders
      WHERE status = 'reçue'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    const formatted = rows.map(r => ({
      date: r.date,
      totalOrders: parseInt(r.totalOrders) || 0
    }));
    res.json({ success: true, ordersPerDay: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
