const Database = require("better-sqlite3");
const db = new Database("domains.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS tracked_domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT UNIQUE,
    email TEXT,
    expiryDate TEXT,
    notified INTEGER DEFAULT 0,
    notifiedDays TEXT DEFAULT '[]'
  )
`).run();

class TrackedRepository {
  constructor() {
    this.db = db;
  }

  getAll() {
    return this.db.prepare("SELECT * FROM tracked_domains").all();
  }

  save(domain, email, expiryDate, notified = 0, notifiedDays = []) {
    try{
    return this.db
      .prepare(
        `INSERT OR REPLACE INTO tracked_domains 
        (domain, email, expiryDate, notified, notifiedDays)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(domain, email, expiryDate, notified, JSON.stringify(notifiedDays));
    } catch (err) {
      console.error(" DB save error:", err.message);
      throw err;
    }
  }

  delete(domain) {
    return this.db
      .prepare("DELETE FROM tracked_domains WHERE domain = ?")
      .run(domain);
  }

  updateEmail(domain, email) {
    return this.db
      .prepare("UPDATE tracked_domains SET email = ? WHERE domain = ?")
      .run(email, domain);
  }

  updateNotifiedDays(domain, notifiedDays) {
    return this.db
      .prepare("UPDATE tracked_domains SET notifiedDays = ? WHERE domain = ?")
      .run(JSON.stringify(notifiedDays), domain);
  }
}

module.exports = TrackedRepository;
