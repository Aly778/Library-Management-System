const db = require('../config/db');

class Book {
  static async findById(bookId) {
    try {
      const [books] = await db.execute(
        `SELECT b.*, a.Aname as author FROM Books b
         LEFT JOIN Book_Authors ba ON b.Bid = ba.Bid
         LEFT JOIN Authors a ON ba.Aid = a.Aid
         WHERE b.Bid = ?`,
        [bookId]
      );
      return books[0] || null;
    } catch (error) {
      throw new Error(`Error finding book: ${error.message}`);
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM Books WHERE 1=1';
      const params = [];

      if (filters.category) {
        query += ' AND Cid = ?';
        params.push(filters.category);
      }

      if (filters.search) {
        query += ' AND (Bname LIKE ? OR BAuthor LIKE ?)';
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      if (filters.minPrice !== undefined) {
        query += ' AND Bprice >= ?';
        params.push(filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query += ' AND Bprice <= ?';
        params.push(filters.maxPrice);
      }

      query += ' ORDER BY Bname ASC';

      const [books] = await db.execute(query, params);
      return books;
    } catch (error) {
      throw new Error(`Error fetching books: ${error.message}`);
    }
  }

  static async findByCategory(categoryId) {
    try {
      const [books] = await db.execute(
        'SELECT * FROM Books WHERE Cid = ? ORDER BY Bname ASC',
        [categoryId]
      );
      return books;
    } catch (error) {
      throw new Error(`Error fetching books by category: ${error.message}`);
    }
  }

  static async create(bookData) {
    try {
      const { categoryId, name, price, pages, publishDate, quantity, description, image, author } = bookData;

      const [result] = await db.execute(
        `INSERT INTO Books (Cid, Bname, Bprice, Bpages, Bpublish_date, Bquantity, Btotal_quantity, Bdescription, Bimage, BAuthor) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [categoryId, name, price, pages, publishDate, quantity, quantity, description, image, author]
      );

      return { Bid: result.insertId, ...bookData };
    } catch (error) {
      throw new Error(`Error creating book: ${error.message}`);
    }
  }

  static async update(bookId, bookData) {
    try {
      const { categoryId, name, price, pages, publishDate, quantity, description, image, author } = bookData;

      await db.execute(
        `UPDATE Books SET Cid = ?, Bname = ?, Bprice = ?, Bpages = ?, Bpublish_date = ?, Bquantity = ?, Bdescription = ?, Bimage = ?, BAuthor = ? 
         WHERE Bid = ?`,
        [categoryId, name, price, pages, publishDate, quantity, description, image, author, bookId]
      );

      return this.findById(bookId);
    } catch (error) {
      throw new Error(`Error updating book: ${error.message}`);
    }
  }

  static async delete(bookId) {
    try {
      const [result] = await db.execute('DELETE FROM Books WHERE Bid = ?', [bookId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting book: ${error.message}`);
    }
  }

  static async updateQuantity(bookId, quantity) {
    try {
      await db.execute(
        'UPDATE Books SET Bquantity = ? WHERE Bid = ?',
        [quantity, bookId]
      );
      return this.findById(bookId);
    } catch (error) {
      throw new Error(`Error updating book quantity: ${error.message}`);
    }
  }

  static async getAvailableQuantity(bookId) {
    try {
      const [books] = await db.execute(
        'SELECT Bquantity FROM Books WHERE Bid = ?',
        [bookId]
      );
      return books[0]?.Bquantity || 0;
    } catch (error) {
      throw new Error(`Error getting book quantity: ${error.message}`);
    }
  }
}

module.exports = Book;
