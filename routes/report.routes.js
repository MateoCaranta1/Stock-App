const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.get('/low-stock', reportController.lowStock);
router.get('/sales', reportController.sales);
router.get('/purchases', reportController.purchases);

module.exports = router;
