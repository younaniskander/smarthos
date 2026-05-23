import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const dbUrl = process.env.DATABASE_URL || "mysql://hospital_user:smart_hospital@localhost:3306/smart_hospital";
  console.log("Connecting to database at:", dbUrl);

  const connection = await mysql.createConnection(dbUrl);

  const sqlFilePath = path.join(__dirname, "migrations", "0001_chunky_rocket_racer.sql");
  console.log("Reading migration file:", sqlFilePath);
  const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

  // Split queries by drizzle's separator
  const queries = sqlContent.split("--> statement-breakpoint");

  console.log(`Executing ${queries.length} migration statements...`);
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i].trim();
    if (!query) continue;

    console.log(`Executing statement ${i + 1}...`);
    try {
      await connection.query(query);
    } catch (err) {
      // If table already exists, ignore and continue
      if (err.code === "ER_TABLE_EXISTS_ERROR") {
        console.log(`Table already exists, skipping.`);
      } else {
        throw err;
      }
    }
  }

  console.log("Migrations successfully applied!");
  await connection.end();
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
