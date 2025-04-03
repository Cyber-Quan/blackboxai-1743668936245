const { query } = require('../config');

module.exports = {
  async create({ name, description, price, image, user_id }) {
    const result = await query(
      'INSERT INTO products (name, description, price, image, user_id) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, image, user_id]
    );
    return result.insertId;
  },

  async findAll() {
    return await query(`
      SELECT p.*, u.username as seller 
      FROM products p
      JOIN users u ON p.user_id = u.id
    `);
  },

  async findById(id) {
    const [product] = await query(`
      SELECT p.*, u.username as seller 
      FROM products p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);
    return product;
  },

  async findByUser(user_id) {
    return await query('SELECT * FROM products WHERE user_id = ?', [user_id]);
  },

  async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    await query(`UPDATE products SET ${fields} WHERE id = ?`, [...values, id]);
  },

  async delete(id) {
    await query('DELETE FROM products WHERE id = ?', [id]);
  }
};