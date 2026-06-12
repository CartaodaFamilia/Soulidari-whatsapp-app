const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Contact = require('../models/Contact');
const AuditLog = require('../models/AuditLog');

exports.handleWebhook = async (req, res) => {
  // Responde 200 IMEDIATAMENTE (obrigatório pela Meta — timeout de 20s)
  res.sendStatus(200);

  if (req.body.object !== 'whatsapp_business_account') return;

  // Processamento assíncrono após responder
  processWebhookAsync(req.body).catch(err => {
    console.error('Erro no processamento assíncrono do webhook:', err);
  });
};

async function processWebhookAsync(body) {
  for (const entry of body.entry) {
    for (const change of entry.changes) {
      const value = change.value;
      if (!value) continue;

      const phoneNumberId = value.metadata?.phone_number_id;

      // Mensagens recebidas
      if (value.messages) {
        for (const msg of value.messages) {
          const contact = await Contact.upsert(
            msg.from,
            value.contacts?.[0]?.user_id || null,
            value.contacts?.[0]?.profile?.name || null
          );

          const conversation = await Conversation.findOrCreate(contact.wa_id, phoneNumberId);

          // Evita duplicatas
          const existing = await isDuplicateMessage(msg.id);
          if (existing) continue;

          await Message.create({
            conversation_id: conversation.id,
            wa_message_id: msg.id,
            direction: 'inbound',
            message_type: msg.type,
            body: msg.text?.body || '',
            timestamp: msg.timestamp,
          });

          await AuditLog.log({
            action: 'MESSAGE_RECEIVED',
            entity_type: 'conversation',
            entity_id: conversation.id,
            performed_by: msg.from,
            details: { message_type: msg.type }
          });
        }
      }

      // Atualização de status
      if (value.statuses) {
        for (const status of value.statuses) {
          await Message.updateStatus(status.id, status.status);
        }
      }
    }
  }
}

// Verifica duplicatas pelo wa_message_id
async function isDuplicateMessage(waMessageId) {
  const pool = require('../config/database');
  const { rows } = await pool.query(
    'SELECT id FROM messages WHERE wa_message_id = $1',
    [waMessageId]
  );
  return rows.length > 0;
}