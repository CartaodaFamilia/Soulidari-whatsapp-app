const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Handshake do webhook (verificação)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('Webhook verificado com sucesso');
    res.status(200).send(challenge);
  } else {
    console.error('Falha na verificação do webhook');
    res.sendStatus(403);
  }
});

// Recebimento de eventos – apenas o controller, sem verifyRequestSignature
router.post('/', webhookController.handleWebhook);

module.exports = router;