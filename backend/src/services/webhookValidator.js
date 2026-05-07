const crypto = require('crypto');

function verifyRequestSignature(req, res, buf) {
  const signature = req.headers['x-hub-signature-256'];

  if (!signature) {
    console.warn('Cabeçalho x-hub-signature-256 ausente – a requisição não será verificada.');
    return;
  }

  const elements = signature.split('=');
  const signatureHash = elements[1];

  const expectedHash = crypto
    .createHmac('sha256', process.env.APP_SECRET)
    .update(buf)
    .digest('hex');

  if (signatureHash !== expectedHash) {
    throw new Error('Assinatura da requisição inválida.');
  }
}

module.exports = verifyRequestSignature;