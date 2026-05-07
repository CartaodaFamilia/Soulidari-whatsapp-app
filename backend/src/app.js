const express = require('express');
const cors = require('cors');
const { urlencoded, json } = require('body-parser');
require('dotenv').config();

const webhookRoutes = require('./routes/webhook');
const conversationRoutes = require('./routes/conversations');
const messageRoutes = require('./routes/messages');
const verifyRequestSignature = require('./services/webhookValidator'); // ← ADICIONE ESTA LINHA

const app = express();

// Middlewares
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json({ verify: verifyRequestSignature })); // agora a variável existe

// Rotas
app.use('/webhook', webhookRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'online', app: 'Soulidari WhatsApp' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});