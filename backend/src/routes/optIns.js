const express = require('express');
const router = express.Router();
const controller = require('../controllers/optInController');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/revoke/:wa_id', controller.revoke);

module.exports = router;