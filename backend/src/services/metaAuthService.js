const axios = require("axios");
const pool = require("../config/db");

async function exchangeCodeForAccessToken(code, client_id) {
    try {
        const { META_APP_ID, META_APP_SECRET, META_REDIRECT_URI } = process.env;
        const response = await axios.get("https://graph.facebook.com/v19.0/oauth/access_token", {
            params: {
                client_id: META_APP_ID,
                client_secret: META_APP_SECRET,
                code: code,
                redirect_uri: META_REDIRECT_URI,
            },
        } );
        const { access_token, expires_in } = response.data;
        const expires_at = new Date(Date.now() + expires_in * 1000);
        await pool.query(
            "INSERT INTO access_tokens (client_id, token, expires_at) VALUES ($1, $2, $3) ON CONFLICT (client_id) DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at",
            [client_id, access_token, expires_at]
        );
        return { access_token, expires_at };
    } catch (error) {
        console.error("Erro no Meta Auth:", error.message);
        throw error;
    }
}

async function getClientAccessToken(client_id) {
    const result = await pool.query("SELECT token FROM access_tokens WHERE client_id = $1 AND expires_at > NOW()", [client_id]);
    return result.rows.length > 0 ? result.rows[0].token : null;
}

async function getClientPhoneNumberId(client_id) {
    const result = await pool.query("SELECT phone_number_id FROM whatsapp_phone_numbers wpn JOIN whatsapp_business_accounts wba ON wpn.waba_account_id = wba.id WHERE wba.client_id = $1 LIMIT 1", [client_id]);
    return result.rows.length > 0 ? result.rows[0].phone_number_id : null;
}

module.exports = { exchangeCodeForAccessToken, getClientAccessToken, getClientPhoneNumberId };