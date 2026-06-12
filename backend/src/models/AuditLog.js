const pool = require('../config/database');

class AuditLog {
  static async log({ action, entity_type, entity_id, performed_by, details = null }) {
    await pool.query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, performed_by, details, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [action, entity_type, entity_id, performed_by, details ? JSON.stringify(details) : null]
    );
  }

  static async getAll(limit = 100) {
    const { rows } = await pool.query(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return rows;
  }
}

module.exports = AuditLog;