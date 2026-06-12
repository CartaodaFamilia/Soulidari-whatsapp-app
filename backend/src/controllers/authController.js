const axios = require('axios');
const Business = require('../models/Business');
const AuditLog = require('../models/AuditLog');

exports.exchangeWhatsAppCode = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Código não fornecido' });
  }

  // 1. Troca o código pelo Access Token
  const response = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
    params: {
      client_id: process.env.META_APP_ID,
      client_secret: process.env.META_APP_SECRET,
      code: code
    }
  });
  const clientAccessToken = response.data.access_token;

  // 2. Debug do token para pegar o WABA ID
  const debugToken = await axios.get('https://graph.facebook.com/debug_token', {
    params: {
      input_token: clientAccessToken,
      access_token: `${process.env.META_APP_ID}|${process.env.META_APP_SECRET}`
    }
  });
  const wabaId = debugToken.data.data.target_ids[0];

  // 3. Buscar números de telefone
  const phoneNumbersRes = await axios.get(`https://graph.facebook.com/v19.0/${wabaId}/phone_numbers`, {
    headers: { Authorization: `Bearer ${clientAccessToken}` }
  });
  const phoneNumbers = phoneNumbersRes.data.data;
  const phoneNumberId = phoneNumbers.length > 0 ? phoneNumbers[0].id : null;

  // 4. Obter nome do perfil
  let profileName = null;
  try {
    const businessRes = await axios.get(`https://graph.facebook.com/v19.0/${wabaId}`, {
      headers: { Authorization: `Bearer ${clientAccessToken}` }
    });
    profileName = businessRes.data.name || null;
  } catch (e) {
    console.warn('Não foi possível obter nome do perfil WABA');
  }

  // 5. Salvar no banco com token criptografado
  await Business.create({
    waba_id: wabaId,
    phone_number_id: phoneNumberId,
    client_token: clientAccessToken,
    profile_name: profileName
  });

  // 6. Auditoria
  await AuditLog.log({
    action: 'BUSINESS_CONNECTED',
    entity_type: 'business',
    entity_id: wabaId,
    performed_by: req.user?.id || 'embedded_signup',
    details: { profileName, phoneNumberId }
  });

  // Subscrever webhook para o WABA
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${wabaId}/subscribed_apps`,
      {},
      { headers: { Authorization: `Bearer ${clientAccessToken}` } }
    );
  } catch (e) {
    console.warn('Não foi possível subscrever webhook automaticamente');
  }

  res.json({
    success: true,
    message: 'Cliente conectado com sucesso!',
    data: { wabaId, phoneNumberId, profileName }
  });
};