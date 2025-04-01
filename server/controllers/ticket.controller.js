const { validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc    Alle Tickets abrufen
// @route   GET /api/tickets
// @access  Private
exports.getTickets = async (req, res) => {
  try {
    let query = {};
    
    // Filteroption nach Status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filteroption nach Priorität
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    
    // Filteroption nach zugewiesenem Benutzer
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }
    
    // Wenn nicht Admin, dann nur eigene oder zugewiesene Tickets anzeigen
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      query.$or = [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ];
    }
    
    // Suchoption für Text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Paginierung
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Sortierung
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      // Standardmäßig nach Erstellungsdatum absteigend sortieren
      sort.createdAt = -1;
    }
    
    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(startIndex)
      .limit(limit);
    
    // Gesamtanzahl der Tickets für Paginierung
    const total = await Ticket.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: tickets.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      tickets
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Tickets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Abrufen der Tickets',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Einzelnes Ticket abrufen
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email')
      .populate('tasks.completedBy', 'name');
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket nicht gefunden' 
      });
    }
    
    // Prüfen, ob Benutzer berechtigt ist, dieses Ticket zu sehen (Admin, Manager, Ersteller oder zugewiesene Person)
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'manager' && 
      ticket.createdBy._id.toString() !== req.user.id && 
      (!ticket.assignedTo || ticket.assignedTo._id.toString() !== req.user.id)
    ) {
      return res.status(403).json({ 
        success: false, 
        message: 'Nicht berechtigt, dieses Ticket anzusehen' 
      });
    }
    
    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Tickets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Abrufen des Tickets',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Neues Ticket erstellen
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    // Validierungsfehler prüfen
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { title, customer, status, priority, description, tasks } = req.body;
    
    // Ticket erstellen
    const ticket = await Ticket.create({
      title,
      customer,
      status: status || 'offen',
      priority: priority || 'mittel',
      description,
      tasks: tasks || [],
      createdBy: req.user.id
    });
    
    // Ticket mit Benutzerdaten abrufen
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      ticket: populatedTicket
    });
  } catch (error) {
    console.error('Fehler beim Erstellen eines Tickets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Erstellen eines Tickets',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Ticket aktualisieren
// @route   PUT /api/tickets/:id
// @access  Private
exports.updateTicket = async (req, res) => {
  try {
    const { title, customer, status, priority, description, assignedTo } = req.body;
    
    let ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket nicht gefunden' 
      });
    }
    
    // Prüfen, ob Benutzer berechtigt ist, dieses Ticket zu bearbeiten
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'manager' && 
      ticket.createdBy.toString() !== req.user.id && 
      (!ticket.assignedTo || ticket.assignedTo.toString() !== req.user.id)
    ) {
      return res.status(403).json({ 
        success: false, 
        message: 'Nicht berechtigt, dieses Ticket zu bearbeiten' 
      });
    }
    
    // Falls sich der Status ändert und auf 'geschlossen' gesetzt wird, Zeitstempel setzen
    if (status === 'geschlossen' && ticket.status !== 'geschlossen') {
      ticket.closedAt = Date.now();
      ticket.closedBy = req.user.id;
    }
    
    // Ticket aktualisieren
    ticket = await Ticket.findByIdAndUpdate(
      req.params.id, 
      { title, customer, status, priority, description, assignedTo },
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('closedBy', 'name email');
    
    // Wenn Ticket einem Benutzer zugewiesen wird, zu dessen assignedTickets hinzufügen
    if (assignedTo && assignedTo !== ticket.assignedTo) {
      await User.findByIdAndUpdate(assignedTo, {
        $addToSet: { assignedTickets: ticket._id }
      });
    }
    
    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Tickets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Aktualisieren des Tickets',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Ticket löschen
// @route   DELETE /api/tickets/:id
// @access  Private (nur Admin und Manager)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket nicht gefunden' 
      });
    }
    
    // Nur Admins und Manager können Tickets löschen
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ 
        success: false, 
        message: 'Nur Administratoren und Manager können Tickets löschen' 
      });
    }
    
    await ticket.deleteOne();
    
    // Ticket aus assignedTickets-Array aller Benutzer entfernen
    if (ticket.assignedTo) {
      await User.updateOne(
        { _id: ticket.assignedTo },
        { $pull: { assignedTickets: ticket._id } }
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Ticket erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Tickets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Löschen des Tickets',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Aufgabe zu Ticket hinzufügen
// @route   POST /api/tickets/:id/tasks
// @access  Private
exports.addTask = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aufgabentext ist erforderlich' 
      });
    }
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket nicht gefunden' 
      });
    }
    
    // Neue Aufgabe erstellen
    const newTask = {
      text,
      completed: false
    };
    
    ticket.tasks.push(newTask);
    await ticket.save();
    
    res.status(201).json({
      success: true,
      task: ticket.tasks[ticket.tasks.length - 1]
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen einer Aufgabe:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Hinzufügen einer Aufgabe',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Aufgabenstatus aktualisieren
// @route   PUT /api/tickets/:id/tasks/:taskId
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { completed, text } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket nicht gefunden' 
      });
    }
    
    // Aufgabe finden
    const task = ticket.tasks.id(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Aufgabe nicht gefunden' 
      });
    }
    
    // Aufgabe aktualisieren
    if (text !== undefined) task.text = text;
    
    // Wenn Status geändert wird
    if (completed !== undefined && task.completed !== completed) {
      task.completed = completed;
      
      // Wenn die Aufgabe als erledigt markiert wird, Zeitstempel und Benutzer hinzufügen
      if (completed) {
        task.completedAt = Date.now();
        task.completedBy = req.user.id;
      } else {
        task.completedAt = undefined;
        task.completedBy = undefined;
      }
    }
    
    await ticket.save();
    
    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Aufgabe:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Aktualisieren der Aufgabe',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Aufgabe löschen
// @route   DELETE /api/tickets/:id/tasks/:taskId
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket nicht gefunden' 
      });
    }
    
    // Aufgabe löschen
    ticket.tasks.id(req.params.taskId).deleteOne();
    await ticket.save();
    
    res.status(200).json({
      success: true,
      message: 'Aufgabe erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Fehler beim Löschen der Aufgabe:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Löschen der Aufgabe',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Kommentar zu Ticket hinzufügen
// @route   POST /api/tickets/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Kommentartext ist erforderlich' 
      });
    }
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket nicht gefunden' 
      });
    }
    
    // Neuen Kommentar erstellen
    const newComment = {
      text,
      user: req.user.id,
      createdAt: Date.now()
    };
    
    ticket.comments.push(newComment);
    await ticket.save();
    
    // Kommentar mit Benutzerdaten abrufen
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('comments.user', 'name email');
    
    const addedComment = populatedTicket.comments[populatedTicket.comments.length - 1];
    
    res.status(201).json({
      success: true,
      comment: addedComment
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen eines Kommentars:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server-Fehler beim Hinzufügen eines Kommentars',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 