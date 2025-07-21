const Database = require("better-sqlite3");
const db = new Database("domains.db");


class TrackedRepository {
  constructor() {
    this.db = db;

    // USERS table
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT,
        password TEXT
      )
    `
    ).run();

    // HISTORY table
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        query TEXT NOT NULL
      )
    `
    ).run();

    // EXPIRY TRACKER table
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS expiry_tracker (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        domain TEXT NOT NULL,
        email TEXT,
        expiryDate TEXT,
        notified INTEGER DEFAULT 0,
        lastNotified TEXT DEFAULT NULL,
        UNIQUE(userId, domain),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `
    ).run();
  }
  
  getAllByUser(userId) {
    const rows = this.db.prepare("SELECT * FROM expiry_tracker WHERE userId = ?").all(userId);
   console.log("Parsed tracked data for user:", userId, rows);
   return rows;
  }

  saveDomainForUser(userId, domain, email, expiryDate, notified = 0, lastNotified = null) {
    return this.db.prepare(`
      INSERT OR REPLACE INTO expiry_tracker 
      (userId, domain, email, expiryDate, notified, lastNotified)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, domain, email, expiryDate, notified, lastNotified);
  }

  updateLastNotified(domain, dateStr) {
    return this.db.prepare(`
      UPDATE expiry_tracker
      SET lastNotified = ?
      WHERE domain = ?
    `).run(dateStr, domain);
  }

  updateTrackedEmail(userId, domain, email) {
    return this.db.prepare(`
      UPDATE expiry_tracker 
      SET email = ?
      WHERE userId = ? AND domain = ?
    `).run(email, userId, domain);
  }

  deleteDomainForUser(userId, domain) {
    return this.db.prepare(`
      DELETE FROM expiry_tracker WHERE userId = ? AND domain = ?
    `).run(userId, domain);
  }

  deleteTrackedDomain(userId, domain) {
    return this.db.prepare(`
      DELETE FROM expiry_tracker WHERE userId = ? AND domain = ?
    `).run(userId, domain);
  }

 getUserByUsername(username) {
    return this.db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  }

createUser(username, email, hashedPassword) {
    return this.db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)").run(username, email, hashedPassword);
  }

 saveHistory(username, query) {
    return this.db.prepare("INSERT INTO history (username, query) VALUES (?, ?)").run(username, query);
  }

  getHistoryByUser(username) {
    const rows = this.db.prepare("SELECT query FROM history WHERE username = ? ORDER BY id DESC LIMIT 10").all(username);
    return rows.map((r) => r.query);
  }
}

module.exports = TrackedRepository;
