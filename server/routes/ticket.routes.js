const express = require('express');
const { check } = require('express-validator');
const ticketController = require('../controllers/ticket.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Alle Routen sind geschützt
router.use(protect);

// @route   GET /api/tickets
// @desc    Alle Tickets abrufen
// @access  Private
router.get('/', ticketController.getTickets);

// @route   GET /api/tickets/:id
// @desc    Einzelnes Ticket abrufen
// @access  Private
router.get('/:id', ticketController.getTicket);

// @route   POST /api/tickets
// @desc    Neues Ticket erstellen
// @access  Private
router.post(
  '/',
  [
    check('title', 'Titel ist erforderlich').not().isEmpty(),
    check('customer', 'Kunde/Abteilung ist erforderlich').not().isEmpty(),
    check('description', 'Beschreibung ist erforderlich').not().isEmpty()
  ],
  ticketController.createTicket
);

// @route   PUT /api/tickets/:id
// @desc    Ticket aktualisieren
// @access  Private
router.put('/:id', ticketController.updateTicket);

// @route   DELETE /api/tickets/:id
// @desc    Ticket löschen
// @access  Private (nur Admin und Manager)
router.delete('/:id', authorize('admin', 'manager'), ticketController.deleteTicket);

// @route   POST /api/tickets/:id/tasks
// @desc    Aufgabe zu Ticket hinzufügen
// @access  Private
router.post('/:id/tasks', ticketController.addTask);

// @route   PUT /api/tickets/:id/tasks/:taskId
// @desc    Aufgabenstatus aktualisieren
// @access  Private
router.put('/:id/tasks/:taskId', ticketController.updateTask);

// @route   DELETE /api/tickets/:id/tasks/:taskId
// @desc    Aufgabe löschen
// @access  Private
router.delete('/:id/tasks/:taskId', ticketController.deleteTask);

// @route   POST /api/tickets/:id/comments
// @desc    Kommentar zu Ticket hinzufügen
// @access  Private
router.post('/:id/comments', ticketController.addComment);

module.exports = router; 