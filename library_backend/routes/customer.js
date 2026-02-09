const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Order = require('../models/Order');
const BorrowBook = require('../models/BorrowBook');
const { authenticate, authorize } = require('../middleware/middleware_auth');

// VIEW ALL BOOKS (Available to any logged-in customer)
router.get('/books', authenticate, authorize(['customer']), async (req, res) => {
    try {
        const books = await Book.findAll();
        const availableBooks = books.filter(b => b.Bquantity > 0);
        res.json({ success: true, books: availableBooks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// VIEW PURCHASE HISTORY
router.get('/purchases', authenticate, authorize(['customer']), async (req, res) => {
    try {
        const userId = req.user.userId;
        const purchases = await Order.getPurchaseHistory(userId);
        res.json({ success: true, purchases });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// VIEW BORROWING HISTORY
router.get('/borrows', authenticate, authorize(['customer']), async (req, res) => {
    try {
        const userId = req.user.userId;
        const borrows = await BorrowBook.getUserBorrowHistory(userId);
        res.json({ success: true, borrows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET ACTIVE BORROWS
router.get('/active-borrows', authenticate, authorize(['customer']), async (req, res) => {
    try {
        const userId = req.user.userId;
        const activeBorrows = await BorrowBook.getActiveBorrows(userId);
        res.json({ success: true, activeBorrows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// BORROW A BOOK
router.post('/borrow', authenticate, authorize(['customer']), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bookId, borrowDays } = req.body;

        const borrowRecord = await BorrowBook.borrowBook(userId, bookId, borrowDays || 14);
        res.status(201).json({ 
            success: true, 
            message: "Book borrowed successfully",
            borrow: borrowRecord 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// RETURN A BOOK
router.post('/return/:borrowId', authenticate, authorize(['customer']), async (req, res) => {
    try {
        const returnRecord = await BorrowBook.returnBook(req.params.borrowId);
        res.json({ 
            success: true, 
            message: "Book returned successfully",
            return: returnRecord 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PURCHASE BOOKS
router.post('/purchase', authenticate, authorize(['customer']), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const purchaseIds = await Order.createPurchaseOrder(userId, items);
        const total = await Order.getOrderTotal(purchaseIds);

        res.status(201).json({ 
            success: true, 
            message: "Purchase completed successfully",
            purchaseIds,
            total 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;