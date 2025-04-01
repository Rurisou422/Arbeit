const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware zum Schutz von Routen
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Token aus dem Authorization-Header lesen
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Prüfen, ob Token existiert
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Kein Token, Zugriff verweigert' 
      });
    }
    
    // Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Benutzer aus der Datenbank laden
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Benutzer nicht gefunden' 
      });
    }
    
    // Benutzerdaten zur Anfrage hinzufügen
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Ungültiger Token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token abgelaufen, bitte neu anmelden' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Authentifizieren',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// Middleware für Berechtigungsprüfung nach Rollen
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Rolle "${req.user.role}" ist nicht berechtigt, auf diese Ressource zuzugreifen` 
      });
    }
    next();
  };
}; 