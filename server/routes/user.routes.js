const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Alle Routen sind geschützt und nur für Administratoren zugänglich
router.use(protect);

// @route   GET /api/users
// @desc    Alle Benutzer abrufen
// @access  Private (nur Admin)
router.get('/', authorize('admin'), userController.getUsers);

// @route   GET /api/users/:id
// @desc    Einzelnen Benutzer abrufen
// @access  Private (Admin oder eigenes Profil)
router.get('/:id', userController.getUser);

// @route   PUT /api/users/:id
// @desc    Benutzerprofil aktualisieren
// @access  Private (Admin oder eigenes Profil)
router.put(
  '/:id',
  [
    check('name', 'Name ist erforderlich').not().isEmpty(),
    check('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein').isEmail()
  ],
  userController.updateUser
);

// @route   DELETE /api/users/:id
// @desc    Benutzer löschen
// @access  Private (nur Admin)
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router; 