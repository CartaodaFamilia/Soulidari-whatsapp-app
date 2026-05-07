const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const whatsappService = require('../services/whatsappService');

exports.send = async (req, res) => {
  try {
    const { conversation_id, to, text } = req.body;
    if (!to || !text) {
      return res.status(400).json({ error: 'Campos "to" e "text" são obrigatórios' });
    }

    // Envia via API do WhatsApp
    const response = await whatsappService.sendTextMessage(to, text);

    // Salva no banco de dados
    let convId = conversation_id;
    if (!convId) {
      // Se não veio o ID da conversa, tenta localizar pelo número
      const conv = await Conversation.findByWaId(to);
      if (conv) convId = conv.id;
    }

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

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message,
    });
  }
};

exports.getByConversation = async (req, res) => {
  try {
    const messages = await Message.getByConversation(req.params.id);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};