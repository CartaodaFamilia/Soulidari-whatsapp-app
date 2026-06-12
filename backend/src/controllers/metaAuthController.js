const metaAuthService = require("../services/metaAuthService");
const pool = require("../config/database");
const axios = require("axios");

async function startMetaOnboarding(req, res) {
  const { META_APP_ID } = process.env;
  // Use o seu domínio da Hostinger como Redirect URI (deve estar configurado no Painel Meta)
  const META_REDIRECT_URI = "https://cartaodetodafamiliasaude.com.br/onboarding";
  
  const metaAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${META_REDIRECT_URI}&scope=whatsapp_business_messaging,whatsapp_business_management`;
  res.redirect(metaAuthUrl);
}

async function handleMetaCallback(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send("Código ausente.");

  try {
    // 1. Identificar o cliente (ajuste conforme seu sistema de login)
    const client_id = 1; 

    // 2. Trocar código pelo Access Token e salvar no banco
    const { access_token } = await metaAuthService.exchangeCodeForAccessToken(code, client_id);

    // 3. BUSCA AUTOMÁTICA: Obter as Contas de WhatsApp (WABA) vinculadas
    const wabaResponse = await axios.get(
      `https://graph.facebook.com/${process.env.API_VERSION}/me/whatsapp_business_accounts`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const wabaAccounts = wabaResponse.data.data;

    for (const waba of wabaAccounts) {
      // Salvar ou atualizar a WABA no banco
      const wabaResult = await pool.query(
        `INSERT INTO whatsapp_business_accounts (client_id, waba_id, name) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (waba_id) DO UPDATE SET name = EXCLUDED.name 
         RETURNING id`,
        [client_id, waba.id, waba.name]
      );
      
      const wabaDbId = wabaResult.rows[0].id;

      // 4. BUSCA AUTOMÁTICA: Obter os Números de Telefone desta WABA
      const phoneResponse = await axios.get(
        `https://graph.facebook.com/${process.env.API_VERSION}/${waba.id}/phone_numbers`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const phoneNumbers = phoneResponse.data.data;

      for (const phone of phoneNumbers) {
        // Salvar ou atualizar o número de telefone no banco
        await pool.query(
          `INSERT INTO whatsapp_phone_numbers 
           (waba_account_id, phone_number_id, display_phone_number, quality_rating, verified_name) 
           VALUES ($1, $2, $3, $4, $5) 
           ON CONFLICT (phone_number_id) DO UPDATE SET 
           display_phone_number = EXCLUDED.display_phone_number,
           quality_rating = EXCLUDED.quality_rating,
           verified_name = EXCLUDED.verified_name`,
          [wabaDbId, phone.id, phone.display_phone_number, phone.quality_rating, phone.verified_name]
        );
      }
    }

    res.status(200).send("Conexão realizada! Seus números foram importados com sucesso.");
  } catch (error) {
    console.error("Erro no callback completo:", error.response ? error.response.data : error.message);
    res.status(500).send("Erro ao processar onboarding e importar dados.");
  }
}

module.exports = { startMetaOnboarding, handleMetaCallback };
