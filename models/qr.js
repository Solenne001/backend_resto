import db from "../config/db.js";

export const QrModel = {
  async getAll() {
    const [rows] = await db.query("SELECT * FROM qr_codes ORDER BY id DESC");
    return rows;
  },

  async getByTableNumber(tableNumber) {
    const [rows] = await db.query("SELECT * FROM qr_codes WHERE table_number = ?", [tableNumber]);
    return rows[0];
  },

  async create(tableNumber, qrUrl) {
    const [result] = await db.query(
      "INSERT INTO qr_codes (table_number, qr_url) VALUES (?, ?)",
      [tableNumber, qrUrl]
    );
    return { id: result.insertId, table_number: tableNumber, qr_url: qrUrl };
  },

  async delete(id) {
    await db.query("DELETE FROM qr_codes WHERE id = ?", [id]);
  },
};
