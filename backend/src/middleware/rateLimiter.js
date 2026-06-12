const rateLimit = require('express-rate-limit');

// Limite geral para API
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  message: { error: 'Muitas requisições. Aguarde antes de tentar novamente.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite para envio de mensagens (respeitar limites da Meta)
exports.messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 80, // Meta permite ~80 msgs/seg no tier básico
  message: { error: 'Limite de envio de mensagens atingido. Aguarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite para webhook (evitar sobrecarga)
exports.webhookLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 500,
  message: { error: 'Muitas requisições no webhook.' },
});