const axios = require("axios");
const { getClientAccessToken, getClientPhoneNumberId } = require("./metaAuthService");

async function sendTextMessage(client_id, to, text) {
  const token = await getClientAccessToken(client_id);
  const phoneId = await getClientPhoneNumberId(client_id);
  const url = `https://graph.facebook.com/${process.env.API_VERSION}/${phoneId}/messages`;
  
  return axios.post(url, {
    messaging_product: "whatsapp",
    to: to,
    text: { body: text }
  }, {
    headers: { Authorization: `Bearer ${token}` }
  } );
}

module.exports = { sendTextMessage };