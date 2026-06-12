const pool = require('../config/database');

class Message {
  static async create({ conversation_id, wa_message_id, direction, message_type, body, timestamp, status = null }) {
    const query = `
      INSERT INTO messages (conversation_id, wa_message_id, direction, message_type, body, timestamp, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
    const values = [conversation_id, wa_message_id, direction, message_type, body, timestamp, status];
    const { rows } = await pool.query(query, values);
    await pool.query(
      'UPDATE conversations SET last_message_at = to_timestamp($1) WHERE id = $2',
      [timestamp, conversation_id]
    );
    return rows[0];
  }

  static async getByConversation(conversation_id, limit = 100) {
    const { rows } = await pool.query(
      `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY timestamp ASC LIMIT $2`,
      [conversation_id, limit]
    );
    return rows;
  }

  static async updateStatus(wa_message_id, newStatus) {
    await pool.query(
      `UPDATE messages SET status = $1 WHERE wa_message_id = $2`,
      [newStatus, wa_message_id]
    );
  }

  // Verifica se a janela de 24h está ativa para um contato
  static async isWithin24hWindow(conversation_id) {
    const { rows } = await pool.query(
      `SELECT timestamp FROM messages
       WHERE conversation_id = $1 AND direction = 'inbound'
       ORDER BY timestamp DESC LIMIT 1`,
      [conversation_id]
    );
    if (!rows[0]) return false;
    const lastInbound = rows[0].timestamp * 1000;
    const now = Date.now();
    const diffHours = (now - lastInbound) / (1000 * 60 * 60);
    return diffHours <= 24;
  }
}

module.exports = Message;