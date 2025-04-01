# IT-Support Ticketsystem

Ein webbasiertes Ticketsystem für IT-Support-Teams mit Benutzerauthentifizierung und Datenbankanbindung.

## Features

- Desktop mit OS-ähnlicher Benutzeroberfläche
- IT-Ticketverwaltung für Support-Anfragen
- Benutzerauthentifizierung (Registrierung und Login)
- Persistente Datenspeicherung in MongoDB
- Aufgabentracking für jeden Ticket
- Status- und Prioritätsverwaltung
- Suchfunktion
- Dark Mode Benutzeroberfläche

## Technischer Stack

- **Frontend:** React, Styled Components, Axios
- **Backend:** Node.js, Express (Entwicklung), Netlify Functions (Produktion)
- **Datenbank:** MongoDB
- **Authentifizierung:** JWT (JSON Web Tokens)

## Voraussetzungen

- Node.js (v14 oder neuer)
- MongoDB (lokale Installation oder MongoDB Atlas)
- npm oder yarn

## Installation

### Backend (Entwicklung)

1. Navigiere zum `server`-Verzeichnis:

```bash
cd server
```

2. Installiere die Abhängigkeiten:

```bash
npm install
```

3. Erstelle eine `.env`-Datei mit folgenden Variablen:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ticketdb
JWT_SECRET=dein_geheimer_schlüssel
```

4. Starte den Server:

```bash
npm start
```

Der Server läuft nun auf `http://localhost:5000`.

### Frontend

1. Navigiere zum Hauptverzeichnis und installiere die Abhängigkeiten:

```bash
npm install
```

2. Erstelle eine `.env`-Datei mit folgenden Variablen:

```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Starte die Anwendung:

```bash
npm start
```

Die Anwendung öffnet sich in deinem Standard-Browser unter `http://localhost:3000`.

## Netlify Deployment

### Einrichtung für Netlify

1. Stelle sicher, dass du einen Netlify Account hast
2. Aktualisiere die MongoDB Verbindungsdaten in der `.env.production` Datei:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://your-mongodb-atlas-uri
JWT_SECRET=your-jwt-secret
```

3. Pushe dein Repository zu GitHub

### Deployment über GitHub

1. Logge dich bei Netlify ein
2. Klicke auf "New site from Git"
3. Wähle GitHub als Git-Provider aus
4. Autorisiere Netlify, auf deine GitHub Repositories zuzugreifen
5. Wähle dein Repository aus
6. Konfiguriere die Build-Einstellungen:
   - Build command: `npm run build`
   - Publish directory: `build`
7. Klicke auf "Deploy site"

### Einrichtung der Umgebungsvariablen in Netlify

1. Gehe zu "Site settings" > "Build & deploy" > "Environment"
2. Füge die folgenden Umgebungsvariablen hinzu:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Deine MongoDB-Verbindungs-URL
   - `JWT_SECRET`: Dein JWT-Secret-Key

## Benutzerhandbuch

### Registrierung & Login

1. Öffne die Anwendung und klicke auf "Registrieren"
2. Gib deine E-Mail, Namen und ein Passwort ein
3. Nach erfolgreicher Registrierung wirst du automatisch eingeloggt
4. Bei späteren Besuchen kannst du dich mit E-Mail und Passwort anmelden

### Tickets verwalten

1. Klicke auf das "IT-Tickets" Symbol auf dem Desktop
2. Erstelle neue Tickets mit dem "Neues Ticket" Button
3. Fülle alle erforderlichen Felder aus (Titel, Kunde/Abteilung, Beschreibung)
4. Weise Status und Priorität zu
5. Füge Aufgaben hinzu, die erledigt werden müssen
6. Die Tickets werden automatisch in der Datenbank gespeichert

## Für Administratoren

Als Administrator kannst du:
- Alle Benutzerkonten verwalten
- Tickets allen Supportmitarbeitern zuweisen
- Statistiken und Berichte einsehen
- Systemeinstellungen anpassen

## Entwicklung

### Frontend-Struktur

```
src/
├── components/
│   ├── apps/
│   │   ├── TicketSystem.js      # Hauptticket-Anwendung
│   │   └── ...
│   ├── auth/
│   │   ├── Login.js             # Login-Komponente
│   │   ├── Register.js          # Registrierungskomponente
│   │   └── AuthContext.js       # Authentifizierungskontext
│   └── ...
├── services/
│   ├── api.js                   # API-Verbindungsdienst
│   ├── auth.service.js          # Authentifizierungsdienst
│   └── ticket.service.js        # Ticket-Verwaltungsdienst
└── ...
```

### Backend-Struktur

```
server/
├── controllers/
│   ├── auth.controller.js       # Authentifizierungslogik
│   ├── ticket.controller.js     # Ticket-Verwaltungslogik
│   └── user.controller.js       # Benutzerverwaltungslogik
├── models/
│   ├── User.js                  # Benutzerdatenmodell
│   └── Ticket.js                # Ticketdatenmodell
├── routes/
│   ├── auth.routes.js           # Authentifizierungsrouten
│   ├── ticket.routes.js         # Ticket-Verwaltungsrouten
│   └── user.routes.js           # Benutzerverwaltungsrouten
├── middleware/
│   ├── auth.js                  # JWT-Authentifizierung
│   └── error.js                 # Fehlerbehandlung
└── server.js                    # Hauptserver-Datei
```

## API-Endpunkte

- `POST /api/auth/register` - Neuen Benutzer registrieren
- `POST /api/auth/login` - Benutzer einloggen
- `GET /api/tickets` - Alle Tickets abrufen
- `POST /api/tickets` - Neues Ticket erstellen
- `GET /api/tickets/:id` - Einzelnes Ticket abrufen
- `PUT /api/tickets/:id` - Ticket aktualisieren
- `DELETE /api/tickets/:id` - Ticket löschen
- `POST /api/tickets/:id/tasks` - Aufgabe zu Ticket hinzufügen
- `PUT /api/tickets/:id/tasks/:taskId` - Aufgabe aktualisieren
- `DELETE /api/tickets/:id/tasks/:taskId` - Aufgabe löschen

## Zukünftige Erweiterungen

- E-Mail-Benachrichtigungen
- Dateianhänge für Tickets
- Live-Chat-Support
- Zeiterfassung für Support-Aktivitäten
- Lokalisierung für mehrere Sprachen
- Mobile App 