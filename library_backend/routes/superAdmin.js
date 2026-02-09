const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { authenticate, authorize } = require('../middleware/middleware_auth');

// 1. ADD EMPLOYEE (Create Admin or another Super Admin)
router.post('/add-employee', authenticate, authorize(['superAdmin']), async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, passkey } = req.body;

        // Validation for Super Admin creation
        if (role === 'superAdmin') {
            const MASTER_PASSKEY = process.env.MASTER_PASSKEY || 'library_secret_2026';
            if (passkey !== MASTER_PASSKEY) {
                return res.status(403).json({ success: false, message: "Invalid passkey for Super Admin creation" });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into Users table
        await db.execute(
            `INSERT INTO Users (Ufirst_name, Ulast_name, Uemail, Upassword, Urole) 
             VALUES (?, ?, ?, ?, ?)`,
            [firstName, lastName, email, hashedPassword, role]
        );

        res.status(201).json({ 
            success: true, 
            message: `${role} account created successfully!` 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. DELETE EMPLOYEE
router.delete('/remove-employee/:id', authenticate, authorize(['superAdmin']), async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user exists and is an employee
        const [user] = await db.execute('SELECT Urole FROM Users WHERE Uid = ?', [userId]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Optional: Prevent deleting the last superAdmin or self-deletion
        if (userId == req.user.userId) {
            return res.status(400).json({ message: "You cannot delete your own account" });
        }

        await db.execute('DELETE FROM Users WHERE Uid = ?', [userId]);
        res.json({ success: true, message: "Employee removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;