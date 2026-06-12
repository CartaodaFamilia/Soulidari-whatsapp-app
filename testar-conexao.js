require('dotenv').config({ path: './backend/.env' }); // 👈 caminho do .env
const pool = require('./backend/src/config/database');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro na conexão:', err.message);
  } else {
    console.log('✅ Conectado com sucesso!', res.rows[0]);
  }
  pool.end();
});