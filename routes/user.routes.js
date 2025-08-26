const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
