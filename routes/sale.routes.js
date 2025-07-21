const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
const authToken = require('../middlewares/authMiddleware');
// const authMiddleware = require('../middlewares/auth.middleware');

// router.use(authMiddleware);

router.post('/', authToken, saleController.create);
router.get('/', authToken, saleController.getAll);

module.exports = router;
