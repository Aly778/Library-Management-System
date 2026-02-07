const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

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

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Library Management System API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
