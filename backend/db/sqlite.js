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

    // ✅ CREATE users table inside the constructor
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT,
        password TEXT
      )
    `).run();
  }

  getAll() {
    return this.db.prepare("SELECT * FROM tracked_domains").all();
  }

  save(domain, email, expiryDate, notified = 0, notifiedDays = []) {
    try {
      return this.db
        .prepare(
          `INSERT OR REPLACE INTO tracked_domains 
            (domain, email, expiryDate, notified, notifiedDays)
            VALUES (?, ?, ?, ?, ?)`
        )
        .run(domain, email, expiryDate, notified, JSON.stringify(notifiedDays));
    } catch (err) {
      console.error("DB save error:", err.message);
      throw err;
    }
  }

  getByDomain(domain) {
    return this.db
      .prepare("SELECT * FROM tracked_domains WHERE domain = ?")
      .get(domain);
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
  
  getUserByUsername(username) {
  return this.db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
}

createUser(username, email, hashedPassword) {
  return this.db
    .prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
    .run(username, email, hashedPassword);
}

}

module.exports = TrackedRepository;
