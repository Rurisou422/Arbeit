const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Titel ist erforderlich'],
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  customer: {
    type: String,
    required: [true, 'Kunde/Abteilung ist erforderlich'],
    trim: true
  },
  status: {
    type: String,
    enum: ['offen', 'in-bearbeitung', 'wartend', 'geschlossen'],
    default: 'offen'
  },
  priority: {
    type: String,
    enum: ['hoch', 'mittel', 'niedrig'],
    default: 'mittel'
  },
  description: {
    type: String,
    required: [true, 'Beschreibung ist erforderlich'],
    trim: true,
    minlength: 5
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tasks: [TaskSchema],
  comments: [{
    text: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  timeTracking: [{
    startTime: Date,
    endTime: Date,
    duration: Number, // in minutes
    description: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  closedAt: {
    type: Date
  },
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Add index for faster searching
TicketSchema.index({ title: 'text', description: 'text', customer: 'text' });

// Virtual for total time spent on ticket
TicketSchema.virtual('totalTimeSpent').get(function() {
  return this.timeTracking.reduce((total, entry) => {
    return total + (entry.duration || 0);
  }, 0);
});

// Calculate task completion percentage
TicketSchema.virtual('taskCompletionPercentage').get(function() {
  if (this.tasks.length === 0) return 0;
  
  const completedTasks = this.tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

// Set timestamps when status changes
TicketSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'geschlossen' && !this.closedAt) {
    this.closedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Ticket', TicketSchema); 