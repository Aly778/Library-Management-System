const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { authenticate, authorize } = require('../middleware/middleware_auth');

// 1. ADD EMPLOYEE (Updated with DOB)
router.post('/add-employee', authenticate, authorize(['superAdmin']), async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, gender, phone, dob } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            `INSERT INTO Users (Ufirst_name, Ulast_name, Uemail, Upassword, Urole, gender, Uphone_number, Udob) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, hashedPassword, role, gender, phone, dob]
        );

        res.status(201).json({ success: true, message: `${role} created successfully!` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. REMOVE EMPLOYEE (Verified via Email and Password)
router.post('/remove-employee', authenticate, authorize(['superAdmin']), async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.execute('SELECT * FROM Users WHERE Uemail = ?', [email]);
        const user = users[0];

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Role verification [Requirement: must be admin or superAdmin]
        if (user.Urole === 'customer') {
            return res.status(403).json({ success: false, message: "That is not an employee" });
        }

        // Credential verification
        const isMatch = await bcrypt.compare(password, user.Upassword);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        await db.execute('DELETE FROM Users WHERE Uid = ?', [user.Uid]);
        res.json({ success: true, message: "Employee removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. VIEW ALL EMPLOYEES
router.get('/employees', authenticate, authorize(['superAdmin']), async (req, res) => {
    try {
        const [employees] = await db.execute(
            "SELECT Ufirst_name, Ulast_name, Urole FROM Users WHERE Urole IN ('admin', 'superAdmin')"
        );
        res.json({ success: true, employees });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. DASHBOARD STATS (Consolidated Purchases)
router.get('/purchases/all', authenticate, authorize(['superAdmin']), async (req, res) => {
    try {
        const [purchases] = await db.execute(`
            SELECT pb.*, u.Ufirst_name, u.Ulast_name, b.Bname 
            FROM Purchase_Books pb
            JOIN Users u ON pb.Uid = u.Uid
            JOIN Books b ON pb.Bid = b.Bid
        `);
        res.json({ success: true, purchases });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;