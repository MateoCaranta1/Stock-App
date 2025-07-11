const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

// router.use(authMiddleware);

router.post('/', saleController.create);
router.get('/', saleController.getAll);

module.exports = router;
