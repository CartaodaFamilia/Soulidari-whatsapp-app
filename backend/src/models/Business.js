const pool = require('../config/database');
const { encrypt, decrypt } = require('../utils/crypto');

class Business {
  static async create({ waba_id, phone_number_id, client_token, profile_name }) {
    const encryptedToken = encrypt(client_token);
    const { rows } = await pool.query(
      `INSERT INTO businesses (waba_id, phone_number_id, client_token, profile_name)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [waba_id, phone_number_id, encryptedToken, profile_name]
    );
    const business = rows[0];
    business.client_token = '[PROTECTED]'; // nunca retornar token
    return business;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT id, waba_id, phone_number_id, profile_name, created_at FROM businesses ORDER BY created_at DESC');
    // Nunca retornar client_token
    return rows;
  }

  static async getTokenByWabaId(waba_id) {
    const { rows } = await pool.query(
      'SELECT client_token FROM businesses WHERE waba_id = $1',
      [waba_id]
    );
    if (!rows[0]) return null;
    return decrypt(rows[0].client_token);
  }

  static async delete(id) {
    await pool.query('DELETE FROM businesses WHERE id = $1', [id]);
  }
}

module.exports = Business;