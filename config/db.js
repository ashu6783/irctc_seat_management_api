
import "dotenv/config";        

import mysql from "mysql2/promise";

// Creating a connection pool with environment variables
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


(async () => {
    try {
        const connection = await db.getConnection();
        console.log("Database connected !");
        connection.release();
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();

export default db;
