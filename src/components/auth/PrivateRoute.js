import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth.service';

/**
 * PrivateRoute-Komponente zum Schutz von Routen, die Authentifizierung erfordern
 * @param {object} props - Component und weitere Props
 * @returns {JSX.Element} - Geschützte Route
 */
const PrivateRoute = ({ children }) => {
  // Prüfen, ob der Benutzer angemeldet ist
  const auth = isAuthenticated();
  
  // Wenn nicht angemeldet, zur Login-Seite umleiten
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  
  // Wenn angemeldet, die geschützte Komponente rendern
  return children;
};

export default PrivateRoute; 