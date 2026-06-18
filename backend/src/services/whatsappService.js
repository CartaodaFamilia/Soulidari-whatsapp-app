const axios = require('axios');

async function sendTextMessage(to, text) {
  const phoneNumberId = process.env.PHONE_NUMBER_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error('PHONE_NUMBER_ID ou META_ACCESS_TOKEN não configurados');
  }

  const url = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;

  const response = await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to: to,
      text: { body: text }
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 30000
    }
  );

  return response.data;
}

module.exports = { sendTextMessage };
