const express = require('express');
const router = express.Router();
const controller = require('../controllers/businessController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, controller.getAll);
router.delete('/:id', authMiddleware, controller.disconnect);

module.exports = router;