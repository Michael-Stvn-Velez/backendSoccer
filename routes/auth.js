const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.registerInitial);
router.post('/register-complete', authController.completeProfile);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authController.changePassword);
router.post('/confirm-account', authController.confirmAccount);
router.post('/resend-confirmation-code', authController.resendConfirmationCode);

module.exports = router;
