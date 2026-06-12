const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const { apiLimiter, messageLimiter } = require('./middleware/rateLimiter');

// Webhook precisa de raw body para validação HMAC
app.use('/webhook', express.raw({ type: 'application/json' }));

// Demais rotas
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rate limiting global
app.use('/api/', apiLimiter);

// Rotas
const webhookRoutes = require('./routes/webhook');
const conversationRoutes = require('./routes/conversations');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const optInRoutes = require('./routes/optIns');
const templateRoutes = require('./routes/templates');
const businessRoutes = require('./routes/businesses');
const contactRoutes = require('./routes/contacts');

app.use('/webhook', webhookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageLimiter, messageRoutes); // rate limit específico para mensagens
app.use('/api/opt-ins', optInRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'online', app: 'Soulidari WhatsApp' });
});

// Health check exigido pela Meta
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});