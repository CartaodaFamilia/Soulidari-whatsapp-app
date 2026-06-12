const Business = require('../models/Business');
const AuditLog = require('../models/AuditLog');

exports.getAll = async (req, res) => {
  const businesses = await Business.getAll();
  res.json(businesses);
};

exports.disconnect = async (req, res) => {
  const { id } = req.params;
  await Business.delete(id);

  await AuditLog.log({
    action: 'BUSINESS_DISCONNECTED',
    entity_type: 'business',
    entity_id: id,
    performed_by: req.user?.id || 'admin',
    details: {}
  });

  res.json({ success: true, message: 'Conta desvinculada com sucesso.' });
};