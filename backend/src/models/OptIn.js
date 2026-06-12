const pool = require('../config/database');

class OptIn {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM opt_ins ORDER BY consent_date DESC');
    return rows;
  }

  static async create({ wa_id, profile_name, source }) {
    const { rows } = await pool.query(
      `INSERT INTO opt_ins (wa_id, profile_name, source, status) VALUES ($1, $2, $3, 'active') RETURNING *`,
      [wa_id, profile_name, source]
    );
    return rows[0];
  }

  static async revoke(wa_id) {
    await pool.query("UPDATE opt_ins SET status = 'revoked' WHERE wa_id = $1", [wa_id]);
  }
}

module.exports = OptIn;