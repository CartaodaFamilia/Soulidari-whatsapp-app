const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const AuditLog = require('../models/AuditLog');
const whatsappService = require('../services/whatsappService');

exports.send = async (req, res) => {
  try {
    const { conversation_id, to, text, is_template } = req.body;

    if (!to || !text) {
      return res.status(400).json({ error: 'Campos "to" e "text" são obrigatórios' });
    }

    let convId = conversation_id;
    if (!convId) {
      const conv = await Conversation.findByWaId(to);
      if (conv) convId = conv.id;
    }

    // Verifica janela de 24h (obrigatório pela Meta)
    if (convId && !is_template) {
      const withinWindow = await Message.isWithin24hWindow(convId);
      if (!withinWindow) {
        return res.status(403).json({
          error: 'Janela de 24h expirada. Use um template aprovado pela Meta para iniciar a conversa.',
          code: 'WINDOW_EXPIRED'
        });
      }
    }

    const response = await whatsappService.sendTextMessage(to, text);

    if (convId) {
      await Message.create({
        conversation_id: convId,
        wa_message_id: response.messages?.[0]?.id || null,
        direction: 'outbound',
        message_type: 'text',
        body: text,
        timestamp: Math.floor(Date.now() / 1000),
        status: 'sent',
      });
    }

    // Auditoria
    await AuditLog.log({
      action: 'MESSAGE_SENT',
      entity_type: 'conversation',
      entity_id: convId,
      performed_by: req.user?.id || 'system',
      details: { to, length: text.length }
    });

    res.json({ success: true, data: response });
  } catch (err) {
    console.error('Erro no controller send:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.getByConversation = async (req, res) => {
  const messages = await Message.getByConversation(req.params.id);
  res.json(messages);
};
