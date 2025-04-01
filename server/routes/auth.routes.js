const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Benutzer registrieren
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name ist erforderlich').not().isEmpty(),
    check('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein').isEmail(),
    check('password', 'Bitte geben Sie ein Passwort mit mindestens 6 Zeichen ein').isLength({ min: 6 })
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Benutzer einloggen
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein').isEmail(),
    check('password', 'Passwort ist erforderlich').exists()
  ],
  authController.login
);

// @route   GET /api/auth/me
// @desc    Aktuellen Benutzer abrufen
// @access  Private
router.get('/me', protect, authController.getMe);

// @route   PUT /api/auth/password
// @desc    Passwort aktualisieren
// @access  Private
router.put(
  '/password',
  [
    protect,
    check('currentPassword', 'Aktuelles Passwort ist erforderlich').exists(),
    check('newPassword', 'Neues Passwort muss mindestens 6 Zeichen lang sein').isLength({ min: 6 })
  ],
  authController.updatePassword
);

module.exports = router; 