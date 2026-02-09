const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.FRONTEND_PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Pass backend URL to frontend
app.use((req, res, next) => {
  res.locals.apiUrl = BACKEND_URL;
  next();
});

// Page Routes
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/catalog', (req, res) => {
  res.render('catalog');
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/inventory', (req, res) => {
  res.render('inventory');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.get('/checkout', (req, res) => {
  res.render('checkout');
});

app.get('/history', (req, res) => {
  res.render('history');
});

// API Routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to the Library Management System',
    backendUrl: BACKEND_URL,
    version: '1.0.0'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Frontend server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎯 Frontend server is running on http://localhost:${PORT}`);
  console.log(`📡 Backend URL configured as: ${BACKEND_URL}`);
});

module.exports = app;
