const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Alle Benutzer abrufen
// @route   GET /api/users
// @access  Private (nur Admin)
exports.getUsers = async (req, res) => {
  try {
    // Paginierung
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Filter nach Rolle
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    // Suchfilter
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { department: searchRegex }
      ];
    }
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    const total = await User.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      users
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Abrufen der Benutzer',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Einzelnen Benutzer abrufen
// @route   GET /api/users/:id
// @access  Private (nur Admin)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('assignedTickets', 'title status priority customer');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Benutzer nicht gefunden' 
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Abrufen des Benutzers',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Benutzerprofil aktualisieren
// @route   PUT /api/users/:id
// @access  Private (Admin oder eigenes Profil)
exports.updateUser = async (req, res) => {
  try {
    // Validierungsfehler prüfen
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { name, email, department, role } = req.body;
    
    // Prüfen, ob Benutzer existiert
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Benutzer nicht gefunden' 
      });
    }
    
    // Prüfen, ob der aktuell angemeldete Benutzer berechtigt ist, diesen Benutzer zu bearbeiten
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Nicht berechtigt, diesen Benutzer zu bearbeiten' 
      });
    }
    
    // Nur Admins dürfen die Rolle ändern
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Nur Administratoren können Benutzerrollen ändern' 
      });
    }
    
    // Aktualisierungsfelder
    const updateFields = { name, email, department };
    
    // Rolle nur setzen, wenn Admin und Feld vorhanden
    if (req.user.role === 'admin' && role) {
      updateFields.role = role;
    }
    
    // Benutzer aktualisieren
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    
    // Behandlung von Duplikat-E-Mail-Fehler
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Diese E-Mail-Adresse wird bereits verwendet' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Aktualisieren des Benutzers',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Benutzer löschen
// @route   DELETE /api/users/:id
// @access  Private (nur Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Benutzer nicht gefunden' 
      });
    }
    
    // Verhindern, dass der Admin sich selbst löscht
    if (req.params.id === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Sie können Ihren eigenen Account nicht löschen' 
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Benutzer erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Löschen des Benutzers',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 