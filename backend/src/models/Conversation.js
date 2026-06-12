const pool = require('../config/database');

class Conversation {
  static async findOrCreate(contact_wa_id, phone_number_id) {
    // Garantir que os IDs sejam tratados como string para evitar erro de tipo no Postgres
    const waIdStr = String(contact_wa_id);
    const phoneIdStr = String(phone_number_id);

    // Procura conversa ativa
    let { rows } = await pool.query(
      `SELECT * FROM conversations WHERE contact_wa_id = $1 AND phone_number_id = $2 AND is_active = true`,
      [waIdStr, phoneIdStr]
    );

    if (rows.length > 0) {
      return rows[0];
    }

    // Cria nova conversa
    const insert = await pool.query(
      `INSERT INTO conversations (contact_wa_id, phone_number_id, is_active) VALUES ($1, $2, true) RETURNING *`,
      [waIdStr, phoneIdStr]
    );
    return insert.rows[0];
  }

  static async getAllWithDetails() {
    const query = `
      SELECT 
        c.id, 
        c.contact_wa_id, 
        co.profile_name, 
        (SELECT body FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message, 
        c.last_message_at 
      FROM conversations c 
      JOIN contacts co ON co.wa_id::text = c.contact_wa_id::text 
      WHERE c.is_active = true 
      ORDER BY c.last_message_at DESC NULLS LAST`;
    
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT c.*, co.profile_name FROM conversations c JOIN contacts co ON co.wa_id::text = c.contact_wa_id::text WHERE c.id = $1`,
      [id]
    );
    return rows[0];
  }

  static async findByWaId(wa_id) {
    const waIdStr = String(wa_id);
    const { rows } = await pool.query(
      'SELECT * FROM conversations WHERE contact_wa_id = $1 AND is_active = true ORDER BY last_message_at DESC LIMIT 1',
      [waIdStr]
    );
    return rows[0];
  }

  static async updateLastMessage(id, timestamp) {
    await pool.query('UPDATE conversations SET last_message_at = to_timestamp($2) WHERE id = $1', [id, timestamp]);
  }
}

module.exports = Conversation;
