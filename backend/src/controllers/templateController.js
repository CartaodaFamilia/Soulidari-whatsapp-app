const Template = require('../models/Template');
const Business = require('../models/Business');
const AuditLog = require('../models/AuditLog');
const axios = require('axios');

exports.getAll = async (req, res) => {
  const templates = await Template.getAll();
  res.json(templates);
};

exports.create = async (req, res) => {
  const { name, display_name, categoria, linguagem, cabecalho, corpo, rodape, waba_id } = req.body;

  if (!name || !corpo) {
    return res.status(400).json({ error: 'Nome e corpo obrigatórios' });
  }

  // Salva localmente
  const tmpl = await Template.create({
    name,
    display_name,
    category: categoria,
    language: linguagem,
    header: cabecalho,
    body: corpo,
    footer: rodape
  });

  // Submete à API da Meta se WABA ID fornecido
  if (waba_id) {
    const clientToken = await Business.getTokenByWabaId(waba_id);
    if (clientToken) {
      const components = [];

      if (cabecalho) {
        components.push({ type: 'HEADER', format: 'TEXT', text: cabecalho });
      }

      components.push({ type: 'BODY', text: corpo });

      if (rodape) {
        components.push({ type: 'FOOTER', text: rodape });
      }

      try {
        await axios.post(
          `https://graph.facebook.com/v19.0/${waba_id}/message_templates`,
          {
            name,
            category: categoria?.toUpperCase() || 'UTILITY',
            language: linguagem || 'pt_BR',
            components
          },
          { headers: { Authorization: `Bearer ${clientToken}` } }
        );

        await Template.updateStatus(tmpl.id, 'submitted');
      } catch (metaErr) {
        console.error('Erro ao submeter template à Meta:', metaErr.response?.data);
        // Não falha — salva como pending para retry manual
      }
    }
  }

  await AuditLog.log({
    action: 'TEMPLATE_CREATED',
    entity_type: 'template',
    entity_id: tmpl.id,
    performed_by: req.user?.id || 'admin',
    details: { name, categoria }
  });

  res.status(201).json(tmpl);
};