// // server/config/db.js
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// export const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export default db;

// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let db;

try {
  // On utilise la variable d'environnement MYSQL_URL créée dans Railway
  db = await mysql.createPool(process.env.MYSQL_URL);

  // Test de connexion
  const [rows] = await db.query("SELECT 1");
  console.log("DB connectée avec succès !");
} catch (err) {
  console.error("Erreur connexion DB :", err);
}

export default db;




