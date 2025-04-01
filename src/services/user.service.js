import api from './api';

// Alle Benutzer abrufen (nur für Admins)
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.users;
  } catch (error) {
    throw error.response?.data || { message: 'Fehler beim Abrufen der Benutzer' };
  }
};

// Einzelnen Benutzer nach ID abrufen
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { message: 'Fehler beim Abrufen des Benutzers' };
  }
};

// Benutzerprofil aktualisieren
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    
    // Wenn der aktuelle Benutzer aktualisiert wird, aktualisieren wir auch die lokalen Daten
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser._id === userId) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { message: 'Fehler beim Aktualisieren des Benutzers' };
  }
};

// Benutzer löschen (nur für Admins)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Fehler beim Löschen des Benutzers' };
  }
};

// Benutzerrollen aktualisieren (nur für Admins)
export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { message: 'Fehler beim Aktualisieren der Benutzerrolle' };
  }
}; 