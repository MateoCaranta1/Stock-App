const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authToken = require('../middlewares/authMiddleware');

router.get('/', authToken, productController.getAll);
router.get('/:id', authToken, productController.getById);
router.post('/', authToken, productController.create);
router.put('/:id', authToken,  productController.update);
router.delete('/:id', authToken,  productController.delete);

module.exports = router;