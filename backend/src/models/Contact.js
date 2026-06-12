const pool = require('../config/database');

class Contact {
  static async upsert(wa_id, user_id = null, profile_name = null) {
    const query = `
      INSERT INTO contacts (wa_id, user_id, profile_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (wa_id) DO UPDATE SET
        user_id = COALESCE(EXCLUDED.user_id, contacts.user_id),
        profile_name = COALESCE(EXCLUDED.profile_name, contacts.profile_name)
      RETURNING *`;
    const values = [wa_id, user_id, profile_name];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByWaId(wa_id) {
    const { rows } = await pool.query('SELECT * FROM contacts WHERE wa_id = $1', [wa_id]);
    return rows[0];
  }


 static async getAll() {
  const query = `
    SELECT c.*, 
           CASE WHEN o.status = 'active' THEN true ELSE false END as opt_in
    FROM contacts c
    LEFT JOIN opt_ins o ON o.contact_wa_id = c.wa_id AND o.status = 'active'
    ORDER BY c.created_at DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
}
}



module.exports = Contact;