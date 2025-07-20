const Database = require("better-sqlite3");
const db = new Database("domains.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS tracked_domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT,
    email TEXT,
    expiryDate TEXT,
    notified INTEGER DEFAULT 0,
    notifiedDays TEXT DEFAULT '[]'
  )
`).run();

class TrackedRepository {
  constructor() {
    this.db = db;

    // USERS table
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT,
        password TEXT
      )
    `).run();

    // HISTORY table
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        query TEXT NOT NULL
      )
    `).run();

    // Expiry tracker table
this.db.prepare(`
  CREATE TABLE IF NOT EXISTS expiry_tracker (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    domain TEXT NOT NULL,
    email TEXT,
    expiryDate TEXT,
    notified INTEGER DEFAULT 0,
    notifiedDays TEXT DEFAULT '[]',
    UNIQUE(username, domain)
  )
`).run();

  }

  getAll() {
    return this.db.prepare("SELECT * FROM tracked_domains").all();
  }

  save(domain, email, expiryDate, notified = 0, notifiedDays = []) {
    return this.db
      .prepare(
        `INSERT OR REPLACE INTO tracked_domains 
          (domain, email, expiryDate, notified, notifiedDays)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(domain, email, expiryDate, notified, JSON.stringify(notifiedDays));
  }

 
saveDomainForUser(username, domain, email, expiryDate, notified = 0, notifiedDays = []) {
  return this.db.prepare(`
    INSERT OR REPLACE INTO expiry_tracker 
    (username, domain, email, expiryDate, notified, notifiedDays)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(username, domain, email, expiryDate, notified, JSON.stringify(notifiedDays));
}


getAllByUser(username) {
  return this.db.prepare(`
    SELECT * FROM expiry_tracker WHERE username = ?
  `).all(username);
}


deleteDomainForUser(username, domain) {
  return this.db.prepare(`
    DELETE FROM expiry_tracker WHERE username = ? AND domain = ?
  `).run(username, domain);
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

  //  User auth methods
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

  //  History methods (per user)
  saveHistory(username, query) {
    return this.db
      .prepare("INSERT INTO history (username, query) VALUES (?, ?)")
      .run(username, query);
  }

  getHistoryByUser(username) {
    const rows = this.db
      .prepare("SELECT query FROM history WHERE username = ? ORDER BY id DESC LIMIT 10")
      .all(username);
    return rows.map((r) => r.query);
  }

  saveTrackedDomainForUser(username, domain, email, expiryDate, notified = 0, notifiedDays = []) {
  return this.db.prepare(`
    INSERT OR REPLACE INTO expiry_tracker
    (username, domain, email, expiryDate, notified, notifiedDays)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(username, domain, email, expiryDate, notified, JSON.stringify(notifiedDays));
}

getTrackedDomainsByUser(username) {
  return this.db.prepare(`
    SELECT * FROM expiry_tracker
    WHERE username = ?
  `).all(username);
}

deleteTrackedDomain(username, domain) {
  return this.db.prepare(`
    DELETE FROM expiry_tracker
    WHERE username = ? AND domain = ?
  `).run(username, domain);
}

updateTrackedEmail(username, domain, email, notifiedDays) {
  return this.db.prepare(`
    UPDATE expiry_tracker 
    SET email = ?, notifiedDays = ?
    WHERE username = ? AND domain = ?
  `).run(email, JSON.stringify(notifiedDays), username, domain);
}
}


module.exports = TrackedRepository;
