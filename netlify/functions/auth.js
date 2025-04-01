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

// Import User model
const User = require('../../server/models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
    const body = JSON.parse(event.body || '{}');
    
    // Route handling
    if (method === 'POST' && segments.length === 0) {
      // Login endpoint
      const { email, password } = body;
      
      // Find the user
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return {
          statusCode: 401,
          body: JSON.stringify({ 
            success: false, 
            message: 'Invalid credentials' 
          })
        };
      }
      
      // Verify password
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return {
          statusCode: 401,
          body: JSON.stringify({ 
            success: false, 
            message: 'Invalid credentials' 
          })
        };
      }
      
      // Update last login timestamp
      user.lastLogin = Date.now();
      await user.save({ validateBeforeSave: false });
      
      // Generate JWT token
      const token = generateToken(user._id);
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
          }
        })
      };
    } 
    else if (method === 'POST' && segments[0] === 'register') {
      // Register endpoint
      const { name, email, password, department } = body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            success: false, 
            message: 'Email already in use' 
          })
        };
      }
      
      // Create new user
      const user = await User.create({
        name,
        email,
        password,
        department: department || 'IT Support'
      });
      
      // Generate JWT token
      const token = generateToken(user._id);
      
      return {
        statusCode: 201,
        body: JSON.stringify({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
          }
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