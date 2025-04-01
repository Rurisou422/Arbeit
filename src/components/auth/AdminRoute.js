import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../../services/auth.service';

/**
 * AdminRoute-Komponente zum Schutz von Routen, die Admin-Berechtigungen erfordern
 * @param {object} props - Component und weitere Props
 * @returns {JSX.Element} - Admin-geschützte Route
 */
const AdminRoute = ({ children }) => {
  // Prüfen, ob der Benutzer angemeldet ist
  const auth = isAuthenticated();
  
  // Wenn nicht angemeldet, zur Login-Seite umleiten
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  
  // Prüfen, ob der Benutzer Admin-Berechtigungen hat
  const currentUser = getCurrentUser();
  const isAdmin = currentUser && currentUser.role === 'admin';
  
  // Wenn kein Admin, zur Hauptseite umleiten
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Wenn Admin, die geschützte Komponente rendern
  return children;
};

export default AdminRoute; 