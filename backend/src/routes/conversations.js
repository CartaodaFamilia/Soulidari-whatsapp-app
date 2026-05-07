const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Listar todas as conversas
router.get('/', conversationController.getAll);

// Obter uma conversa específica por ID (precisamos também dos dados do contato)
router.get('/:id', conversationController.getById);

module.exports = router;