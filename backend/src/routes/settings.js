const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const envPath = path.join(__dirname, '../../.env');

// Ler configurações (retorna valores do .env, exceto senhas)
router.get('/', (req, res) => {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const config = {};
    const lines = envContent.split('\n');
    for (const line of lines) {
      const match = line.match(/^([A-Z_]+)=(.+)$/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();
        // Não enviar tokens completos por segurança (apenas os primeiros 10 caracteres)
        if (key.includes('TOKEN') || key.includes('SECRET')) {
          if (value.length > 10) value = value.substring(0, 10) + '••••••••';
        }
        config[key] = value;
      }
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler configurações' });
  }
});

// Atualizar configurações (recebe objeto com pares chave=valor)
router.post('/', (req, res) => {
  try {
    const updates = req.body;
    let envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    const newLines = lines.map(line => {
      const match = line.match(/^([A-Z_]+)=/);
      if (match && updates[match[1]] !== undefined) {
        return `${match[1]}=${updates[match[1]]}`;
      }
      return line;
    });
    // Adicionar novas chaves que não existiam
    for (const [key, value] of Object.entries(updates)) {
      if (!lines.some(line => line.startsWith(`${key}=`))) {
        newLines.push(`${key}=${value}`);
      }
    }
    fs.writeFileSync(envPath, newLines.join('\n'));
    // Reiniciar o backend para aplicar novas variáveis
    const { exec } = require('child_process');
    exec('pm2 restart soulidari-backend --update-env', (err, stdout, stderr) => {
      if (err) console.error('Erro ao reiniciar:', err);
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar configurações' });
  }
});

module.exports = router;
