const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

// router.use(authMiddleware);

router.post('/', purchaseController.create);
router.get('/', purchaseController.getAll);

module.exports = router;
