const pool = require('../config/database');

class Template {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM templates ORDER BY created_at DESC');
    return rows;
  }

  static async create({ name, display_name, category, language, header, body, footer }) {
    const { rows } = await pool.query(
      `INSERT INTO templates (name, display_name, category, language, header, body, footer, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
      [name, display_name, category, language, header, body, footer]
    );
    return rows[0];
  }

  static async updateStatus(id, status) {
    await pool.query('UPDATE templates SET status = $1 WHERE id = $2', [status, id]);
  }
}

module.exports = Template;