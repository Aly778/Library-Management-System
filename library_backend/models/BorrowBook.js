const db = require('../config/db');

class BorrowBook {
  static async borrowBook(userId, bookId, borrowDays = 14) {
    try {
      const [book] = await db.execute(
        'SELECT Bquantity FROM Books WHERE Bid = ?',
        [bookId]
      );

      if (!book[0] || book[0].Bquantity <= 0) {
        throw new Error('Book not available for borrowing');
      }

      const borrowDate = new Date();
      const expDate = new Date(borrowDate);
      expDate.setDate(expDate.getDate() + borrowDays);

      const [result] = await db.execute(
        `INSERT INTO Borrow_Books (Uid, Bid, borrow_date, exp_date, borrow_status) 
         VALUES (?, ?, ?, ?, 'Borrowed')`,
        [userId, bookId, this.formatDate(borrowDate), this.formatDate(expDate)]
      );

      return { borrowId: result.insertId, borrowDate, expDate };
    } catch (error) {
      throw new Error(`Error borrowing book: ${error.message}`);
    }
  }

  static async returnBook(borrowId, submittingDate = new Date()) {
    try {
      const [borrow] = await db.execute(
        'SELECT * FROM Borrow_Books WHERE borrow_id = ?',
        [borrowId]
      );

      if (!borrow[0]) {
        throw new Error('Borrow record not found');
      }

      const expDate = new Date(borrow[0].exp_date);
      const returnDate = new Date(submittingDate);
      const status = returnDate > expDate ? 'Overdue' : 'Returned';

      await db.execute(
        `UPDATE Borrow_Books SET submitting_date = ?, borrow_status = ? 
         WHERE borrow_id = ?`,
        [this.formatDate(returnDate), status, borrowId]
      );

      return { borrowId, status, returnDate };
    } catch (error) {
      throw new Error(`Error returning book: ${error.message}`);
    }
  }

  static async getUserBorrowHistory(userId) {
    try {
      const [borrows] = await db.execute(
        `SELECT bb.*, b.Bname, b.Bimage, b.BAuthor
         FROM Borrow_Books bb
         JOIN Books b ON bb.Bid = b.Bid
         WHERE bb.Uid = ?
         ORDER BY bb.borrow_date DESC`,
        [userId]
      );

      return borrows;
    } catch (error) {
      throw new Error(`Error fetching borrow history: ${error.message}`);
    }
  }

  static async getActiveBorrows(userId) {
    try {
      const [borrows] = await db.execute(
        `SELECT bb.*, b.Bname, b.Bimage, b.BAuthor
         FROM Borrow_Books bb
         JOIN Books b ON bb.Bid = b.Bid
         WHERE bb.Uid = ? AND bb.borrow_status = 'Borrowed'
         ORDER BY bb.exp_date ASC`,
        [userId]
      );

      return borrows;
    } catch (error) {
      throw new Error(`Error fetching active borrows: ${error.message}`);
    }
  }

  static async getOverdueBooks() {
    try {
      const [borrows] = await db.execute(
        `SELECT bb.*, b.Bname, b.BAuthor, u.Ufirst_name, u.Ulast_name, u.Uemail
         FROM Borrow_Books bb
         JOIN Books b ON bb.Bid = b.Bid
         JOIN Users u ON bb.Uid = u.Uid
         WHERE bb.borrow_status = 'Borrowed' AND bb.exp_date < NOW()`
      );

      return borrows;
    } catch (error) {
      throw new Error(`Error fetching overdue books: ${error.message}`);
    }
  }

  static formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static async getStatistics() {
    try {
      const [stats] = await db.execute(`
        SELECT 
          COUNT(*) as totalBorrows,
          SUM(CASE WHEN borrow_status = 'Borrowed' THEN 1 ELSE 0 END) as activeBorrows,
          SUM(CASE WHEN borrow_status = 'Returned' THEN 1 ELSE 0 END) as returnedBooks,
          SUM(CASE WHEN borrow_status = 'Overdue' THEN 1 ELSE 0 END) as overdueBooks
        FROM Borrow_Books
      `);

      return stats[0];
    } catch (error) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }
}

module.exports = BorrowBook;
