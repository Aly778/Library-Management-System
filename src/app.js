const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Library Management System API' });
});

// Fallback: serve index.html for non-API routes
app.get('*path', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
