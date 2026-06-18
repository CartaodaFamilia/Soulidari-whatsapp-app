const path = require('path');
//require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
  PORT: process.env.PORT || 3001,
  PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,
  META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN,
  API_VERSION: process.env.API_VERSION || 'v23.0',
  FRONTEND_URL: process.env.FRONTEND_URL,
  // outras variáveis que você precisar
};
