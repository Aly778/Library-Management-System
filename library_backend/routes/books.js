const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Category = require('../models/Category');
const { authenticate, authorize } = require('../middleware/middleware_auth');

// Public Routes

// GET all books (public - for catalog)
router.get('/public/all', async (req, res) => {
    try {
        const filters = {};
        if (req.query.category) filters.category = req.query.category;
        if (req.query.search) filters.search = req.query.search;
        if (req.query.minPrice) filters.minPrice = req.query.minPrice;
        if (req.query.maxPrice) filters.maxPrice = req.query.maxPrice;

        const books = await Book.findAll(filters);
        res.json({ success: true, books });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET categories (public)
router.get('/public/categories', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET all books (accessible to customers)
router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.category) filters.category = req.query.category;
        if (req.query.search) filters.search = req.query.search;
        if (req.query.minPrice) filters.minPrice = req.query.minPrice;
        if (req.query.maxPrice) filters.maxPrice = req.query.maxPrice;

        const books = await Book.findAll(filters);
        res.json({ success: true, books });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.json({ success: true, book });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET categories
router.get('/categories/all', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Protected Routes (SuperAdmin/Admin only)

// ADD A BOOK (Super Admin only)
router.post('/', authenticate, authorize(['superAdmin']), async (req, res) => {
    try {
        const { categoryId, name, price, pages, publishDate, quantity, description, author } = req.body;
        
        const newBook = await Book.create({
            categoryId,
            name,
            price,
            pages,
            publishDate,
            quantity,
            description,
            author
        });

        res.status(201).json({ success: true, message: "Book added successfully!", book: newBook });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// EDIT A BOOK (Super Admin only)
router.put('/:id', authenticate, authorize(['superAdmin']), async (req, res) => {
    try {
        const { categoryId, name, price, pages, publishDate, quantity, description, author } = req.body;
        
        const updatedBook = await Book.update(req.params.id, {
            categoryId,
            name,
            price,
            pages,
            publishDate,
            quantity,
            description,
            author
        });

        res.json({ success: true, message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE A BOOK (Super Admin only)
router.delete('/:id', authenticate, authorize(['superAdmin']), async (req, res) => {
    try {
        const deleted = await Book.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.json({ success: true, message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// VIEW STOCK (Admin & Super Admin)
router.get('/stock/inventory', authenticate, authorize(['admin', 'superAdmin']), async (req, res) => {
    try {
        const books = await Book.findAll();
        const inventory = books.map(b => ({
            bookId: b.Bid,
            name: b.Bname,
            quantity: b.Bquantity,
            totalQuantity: b.Btotal_quantity,
            price: b.Bprice
        }));
        res.json({ success: true, inventory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;