const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');
const authToken = require('../middlewares/authMiddleware');
// const authMiddleware = require('../middlewares/auth.middleware');

// router.use(authMiddleware);

router.post('/', authToken, purchaseController.create);
router.get('/', authToken, purchaseController.getAll);

module.exports = router;
