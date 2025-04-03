const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '../ecommerce.db');
const db = new sqlite3.Database(dbPath);

module.exports = {
  query: (sql, params) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  connect: async () => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Create tables
        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          image TEXT DEFAULT 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          image TEXT DEFAULT 'https://images.pexels.com/photos/676540/pexels-photo-676540.jpeg',
          user_id INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        // Create admin user
        db.get("SELECT id FROM users WHERE email = 'admin@example.com'", [], (err, row) => {
          if (!row) {
            db.run(`INSERT INTO users (username, email, password, role) 
                   VALUES (?, ?, ?, ?)`, 
                   ['admin', 'admin@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.MH/rH8Lb6F5J7L2Uw4iB5AgBQd4U1W', 'admin']);
          }
          console.log('SQLite database ready');
          resolve();
        });
      });
    });
  }
};