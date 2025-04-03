const { query } = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  async create({ username, email, password, role = 'user', image }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (username, email, password, role, image) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role, image]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [user] = await query('SELECT * FROM users WHERE email = ?', [email]);
    return user;
  },

  async findById(id) {
    const [user] = await query('SELECT * FROM users WHERE id = ?', [id]);
    return user;
  },

  async update(id, updates) {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    await query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
  },

  async delete(id) {
    await query('DELETE FROM users WHERE id = ?', [id]);
  },

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  },

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
};