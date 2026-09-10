import mysql from "mysql2/promise";

try {
  const connection = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql",
    database: "bagstore"
  });

  console.log("✅ Connected to MySQL!");
  await connection.end();

} catch (error) {
  console.error(error);
}