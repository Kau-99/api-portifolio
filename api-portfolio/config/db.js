const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function openDb() {
  return open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
}
async function initDb() {
  const db = await openDb();
  await db.exec(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            year INTEGER
        )
    `);
}
initDb();

module.exports = { openDb };
