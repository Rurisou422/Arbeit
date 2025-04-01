const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// JWT-Token generieren
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Benutzer registrieren
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Validierungsfehler prüfen
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { name, email, password, department } = req.body;
    
    // Prüfen, ob E-Mail bereits verwendet wird
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Diese E-Mail-Adresse wird bereits verwendet' 
      });
    }
    
    // Neuen Benutzer erstellen
    const user = await User.create({
      name,
      email,
      password,
      department: department || 'IT Support'
    });
    
    // JWT-Token generieren
    const token = generateToken(user._id);
    
    // Antwort senden
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler bei der Registrierung',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Benutzer einloggen
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Benutzer in der Datenbank suchen
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Ungültige Anmeldedaten' 
      });
    }
    
    // Passwort überprüfen
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Ungültige Anmeldedaten' 
      });
    }
    
    // Letzten Login-Zeitpunkt aktualisieren
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    
    // JWT-Token generieren
    const token = generateToken(user._id);
    
    // Antwort senden
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login-Fehler:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Login',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Aktuellen Benutzer abrufen
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('assignedTickets', 'title status priority');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzerprofils:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Abrufen des Benutzerprofils',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Passwort aktualisieren
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Benutzer mit Passwort abrufen
    const user = await User.findById(req.user.id).select('+password');
    
    // Prüfen, ob das aktuelle Passwort stimmt
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Aktuelles Passwort ist falsch' 
      });
    }
    
    // Neues Passwort setzen
    user.password = newPassword;
    await user.save();
    
    // JWT-Token erneuern
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'Passwort erfolgreich aktualisiert',
      token
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Passworts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Aktualisieren des Passworts',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 