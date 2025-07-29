const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');
const authToken = require('../middlewares/authMiddleware');


router.post('/', authToken, purchaseController.create);
router.get('/', authToken, purchaseController.getAll);

module.exports = router;
