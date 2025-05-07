const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Set up template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Set up CORS for API usage
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Routes
app.use('/person', require('./routes/personRoutes'));

// Redirect root to /person
app.get('/', (req, res) => {
  res.redirect('/person');
});

// Handle 404 errors
app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).render('404', { 
      title: '404 - Page Not Found',
      message: 'The page you are looking for does not exist.' 
    });
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});

// Handle other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (req.accepts('html')) {
    res.status(500).render('error', { 
      title: 'Server Error',
      message: 'Something went wrong on our side.' 
    });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/person`);
});

// Export app for testing
module.exports = app;