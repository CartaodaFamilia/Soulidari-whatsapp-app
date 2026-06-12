const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const webhookController = require('../controllers/webhookController');
const { webhookLimiter } = require('../middleware/rateLimiter');

// Verificação (GET)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('Webhook verificado com sucesso');
    return res.status(200).send(challenge);
  }
  console.error('Falha na verificação do webhook');
  res.sendStatus(403);
});

// Recebimento de eventos (POST)
router.post('/', webhookLimiter, (req, res) => {
  const signature = req.headers['x-hub-signature-256'];

  if (process.env.APP_SECRET && signature) {
    const rawBody = req.body; // Buffer (via express.raw)
    const expected = crypto
      .createHmac('sha256', process.env.APP_SECRET)
      .update(rawBody)
      .digest('hex');

    if (signature !== `sha256=${expected}`) {
      console.warn('Assinatura inválida no webhook');
      return res.sendStatus(200); // IMPORTANTE: retornar 200 mesmo em falha de assinatura
      // para evitar que a Meta desative o webhook por erros repetidos
    }
  }

  let body;
  try {
    body = JSON.parse(req.body.toString());
  } catch (e) {
    console.error('Erro ao parsear body do webhook:', e);
    return res.sendStatus(200);
  }

  req.body = body;
  webhookController.handleWebhook(req, res);
});

module.exports = router;