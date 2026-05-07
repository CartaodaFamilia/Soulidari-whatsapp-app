const Conversation = require('../models/Conversation');

exports.getAll = async (req, res) => {
  try {
    const conversations = await Conversation.getAllWithDetails();
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar conversas' });
  }
};

exports.getById = async (req, res) => {
  try {
    const conversation = await Conversation.getById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversa não encontrada' });
    }
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar conversa' });
  }
};