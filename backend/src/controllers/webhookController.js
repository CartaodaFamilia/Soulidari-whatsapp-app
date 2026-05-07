const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Contact = require('../models/Contact');

exports.handleWebhook = async (req, res) => {
  if (req.body.object !== 'whatsapp_business_account') {
    return res.sendStatus(200);
  }

  try {
    for (const entry of req.body.entry) {
      for (const change of entry.changes) {
        const value = change.value;
        if (!value) continue;

        const phoneNumberId = value.metadata.phone_number_id;

        // Processa mensagens recebidas
        if (value.messages) {
          for (const msg of value.messages) {
            // Cria ou atualiza contato
            const contact = await Contact.upsert(
              msg.from,
              value.contacts?.[0]?.user_id || null,
              value.contacts?.[0]?.profile?.name || null
            );

            // Encontra ou cria conversa
            const conversation = await Conversation.findOrCreate(contact.wa_id, phoneNumberId);

            // Salva mensagem
            await Message.create({
              conversation_id: conversation.id,
              wa_message_id: msg.id,
              direction: 'inbound',
              message_type: msg.type,
              body: msg.text?.body || '',
              timestamp: msg.timestamp,
            });

            console.log(`Mensagem recebida de ${msg.from}: ${msg.text?.body}`);
          }
        }

        // Atualiza status de mensagens enviadas
        if (value.statuses) {
          for (const status of value.statuses) {
            await Message.updateStatus(status.id, status.status);
            console.log(`Status atualizado: ${status.id} -> ${status.status}`);
          }
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    res.sendStatus(500);
  }
};