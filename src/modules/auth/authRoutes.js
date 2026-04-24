const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { protect, checkVerified } = require('./auth.middleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/verify-email/:token', auth.verifyEmail);

// Route de test protégée
router.post('/order-test', protect, checkVerified, (req, res) => {
  res.json({ message: "Commande réussie !" });
});

module.exports = router;