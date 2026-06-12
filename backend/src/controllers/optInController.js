const OptIn = require('../models/OptIn');

exports.getAll = async (req, res) => {
  try {
    const data = await OptIn.getAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { wa_id, profile_name, source } = req.body;
  if (!wa_id) return res.status(400).json({ error: 'wa_id obrigatório' });
  try {
    const opt = await OptIn.create({ wa_id, profile_name, source });
    res.status(201).json(opt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.revoke = async (req, res) => {
  const { wa_id } = req.params;
  try {
    await OptIn.revoke(wa_id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};