import express from "express";
import db from "../config/db.js";

const router = express.Router();

/**
 * ✅ 1️⃣ Nombre de commandes d'aujourd'hui
 */
router.get("/orders-today", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS totalOrders
      FROM orders
      WHERE DATE(created_at) = CURDATE()
    `);
    res.json({ success: true, totalOrders: rows[0].totalOrders || 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ 2️⃣ Revenus d'aujourd'hui
 */
router.get("/revenue-today", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT SUM(total_amount) AS totalRevenue
      FROM orders
      WHERE DATE(created_at) = CURDATE()
    `);
    res.json({ 
      success: true, 
      totalRevenue: parseFloat(rows[0].totalRevenue) || 0 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ 3️⃣ Statistiques du mois actuel
 */
router.get("/monthly", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        COUNT(*) AS totalOrders,
        SUM(total_amount) AS totalRevenue
      FROM orders
      WHERE MONTH(created_at) = MONTH(CURDATE())
      AND YEAR(created_at) = YEAR(CURDATE())
    `);

    res.json({
      success: true,
      totalOrders: rows[0].totalOrders || 0,
      totalRevenue: parseFloat(rows[0].totalRevenue) || 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ 4️⃣ Commandes par jour (Graphique)
 */
router.get("/orders-per-day", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as totalOrders
      FROM orders
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const formatted = rows.map((r) => ({
      date: r.date,
      totalOrders: parseInt(r.totalOrders) || 0,
    }));

    res.json({ success: true, ordersPerDay: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * ✅ 5️⃣ Top 5 des plats vendus
 */
router.get("/top-dishes", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.name, SUM(oi.quantity) as totalSold
      FROM order_items oi
      JOIN menus m ON oi.menu_id = m.id
      JOIN orders o ON oi.order_id = o.id
      GROUP BY m.id, m.name
      ORDER BY totalSold DESC
      LIMIT 5
    `);

    const formatted = rows.map((r) => ({
      dish: r.name,
      count: parseInt(r.totalSold) || 0,
    }));

    res.json({ success: true, topDishes: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
