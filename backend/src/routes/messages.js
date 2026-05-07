const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Enviar mensagem de texto
router.post('/send', messageController.send);

// Buscar mensagens de uma conversa
router.get('/conversation/:id', messageController.getByConversation);

module.exports = router;