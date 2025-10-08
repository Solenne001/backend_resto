// server/models/client.js
import db  from "../config/db.js";

// Créer un client
export const createClient = async ({ name, table_number, type }) => {
  const [result] = await db.query(
    "INSERT INTO clients (name, table_number, type) VALUES (?,?,?)",
    [
      name && name.trim() !== "" ? name : null,
      table_number && table_number.trim() !== "" ? table_number : null,
      type
    ]
  );

  return {
    id: result.insertId,
    name: name && name.trim() !== "" ? name : null,
    table_number: table_number && table_number.trim() !== "" ? table_number : null,
    type,
  };
};

// Récupérer tous les clients
export const getClients = async () => {
  const [rows] = await db.query("SELECT * FROM clients ORDER BY created_at DESC");
  return rows;
};
