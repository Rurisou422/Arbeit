const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Import models
const Ticket = require('../../server/models/Ticket');
const User = require('../../server/models/User');

// Middleware to verify JWT token
const verifyToken = async (event) => {
  try {
    // Get token from header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Unauthorized - No token provided', status: 401 };
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return { error: 'Unauthorized - User not found', status: 401 };
    }
    
    return { user };
  } catch (error) {
    return { error: 'Unauthorized - Invalid token', status: 401 };
  }
};

exports.handler = async (event, context) => {
  // For local dev only - avoid timeout issues
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    // Connect to the database
    await connectDB();
    
    const path = event.path.replace(/\/\.netlify\/functions\/[^/]+/, '');
    const segments = path.split('/').filter(Boolean);
    const method = event.httpMethod;
    
    // Verify authentication for all routes
    const auth = await verifyToken(event);
    if (auth.error) {
      return {
        statusCode: auth.status,
        body: JSON.stringify({ success: false, message: auth.error })
      };
    }
    
    const userId = auth.user._id;
    const body = JSON.parse(event.body || '{}');
    
    // GET /api/tickets - Get all tickets
    if (method === 'GET' && segments.length === 0) {
      let query = {};
      
      // If user is not admin, only show assigned tickets or tickets created by user
      if (auth.user.role !== 'admin') {
        query = {
          $or: [
            { createdBy: userId },
            { assignedTo: userId }
          ]
        };
      }
      
      const tickets = await Ticket.find(query)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ updatedAt: -1 });
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          count: tickets.length,
          data: tickets
        })
      };
    }
    
    // POST /api/tickets - Create new ticket
    if (method === 'POST' && segments.length === 0) {
      const ticket = await Ticket.create({
        ...body,
        createdBy: userId
      });
      
      return {
        statusCode: 201,
        body: JSON.stringify({
          success: true,
          data: ticket
        })
      };
    }
    
    // GET /api/tickets/:id - Get single ticket
    if (method === 'GET' && segments.length === 1) {
      const ticket = await Ticket.findById(segments[0])
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
      
      if (!ticket) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            success: false,
            message: 'Ticket not found'
          })
        };
      }
      
      // Check if user has access to this ticket
      if (auth.user.role !== 'admin' && 
          ticket.createdBy._id.toString() !== userId.toString() && 
          (!ticket.assignedTo || ticket.assignedTo._id.toString() !== userId.toString())) {
        return {
          statusCode: 403,
          body: JSON.stringify({
            success: false,
            message: 'Not authorized to access this ticket'
          })
        };
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: ticket
        })
      };
    }
    
    // PUT /api/tickets/:id - Update ticket
    if (method === 'PUT' && segments.length === 1) {
      let ticket = await Ticket.findById(segments[0]);
      
      if (!ticket) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            success: false,
            message: 'Ticket not found'
          })
        };
      }
      
      // Check if user has access to update this ticket
      if (auth.user.role !== 'admin' && 
          ticket.createdBy.toString() !== userId.toString() && 
          (!ticket.assignedTo || ticket.assignedTo.toString() !== userId.toString())) {
        return {
          statusCode: 403,
          body: JSON.stringify({
            success: false,
            message: 'Not authorized to update this ticket'
          })
        };
      }
      
      ticket = await Ticket.findByIdAndUpdate(segments[0], body, {
        new: true,
        runValidators: true
      }).populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: ticket
        })
      };
    }
    
    // DELETE /api/tickets/:id - Delete ticket
    if (method === 'DELETE' && segments.length === 1) {
      const ticket = await Ticket.findById(segments[0]);
      
      if (!ticket) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            success: false,
            message: 'Ticket not found'
          })
        };
      }
      
      // Check if user has access to delete this ticket (admin or creator)
      if (auth.user.role !== 'admin' && ticket.createdBy.toString() !== userId.toString()) {
        return {
          statusCode: 403,
          body: JSON.stringify({
            success: false,
            message: 'Not authorized to delete this ticket'
          })
        };
      }
      
      await ticket.remove();
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: {}
        })
      };
    }
    
    // Return 404 for all other routes
    return {
      statusCode: 404,
      body: JSON.stringify({
        success: false,
        message: 'Route not found'
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Server error',
        error: process.env.NODE_ENV === 'production' ? null : error.message
      })
    };
  }
}; 