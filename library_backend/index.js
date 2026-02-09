const express = require('express');
require('dotenv').config();
const cors = require('cors'); // Added this line
const db = require('./config/db'); 

// Import Routes
const authRoutes = require('./routes/auth'); 
const bookRoutes = require('./routes/books');
const customerRoutes = require('./routes/customer'); 
const superAdminRoutes = require('./routes/superAdmin');

const app = express(); 

// 1. CORS Middleware (Updated to use the official cors package)
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// 2. Global Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 3. Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/admin/books', bookRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/superAdmin', superAdminRoutes); 

// 4. Test route
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Categories LIMIT 1');
        res.json({
            success: true,
            message: "Database is connected!",
            sampleData: rows
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});