const db = require('../config/db');

class Order {
  static async createPurchaseOrder(userId, orderItems) {
    try {
      const purchaseIds = [];

      for (const item of orderItems) {
        const [book] = await db.execute(
          'SELECT Bprice, Bquantity FROM Books WHERE Bid = ?',
          [item.Bid]
        );

        if (!book[0]) {
          throw new Error(`Book ${item.Bid} not found`);
        }

        if (book[0].Bquantity < item.quantity) {
          throw new Error(`Insufficient quantity for book ${item.Bid}`);
        }

        // Create purchase record
        const [result] = await db.execute(
          `INSERT INTO Purchase_Books (Uid, Bid, Pprice, Pquantity) 
           VALUES (?, ?, ?, ?)`,
          [userId, item.Bid, book[0].Bprice, item.quantity]
        );

        // Update book quantity
        const newQuantity = book[0].Bquantity - item.quantity;
        await db.execute(
          'UPDATE Books SET Bquantity = ? WHERE Bid = ?',
          [newQuantity, item.Bid]
        );

        purchaseIds.push(result.insertId);
      }

      return purchaseIds;
    } catch (error) {
      throw new Error(`Error creating purchase order: ${error.message}`);
    }
  }

  static async getPurchaseHistory(userId) {
    try {
      const [purchases] = await db.execute(
        `SELECT pb.*, b.Bname, b.Bimage, b.BAuthor 
         FROM Purchase_Books pb
         JOIN Books b ON pb.Bid = b.Bid
         WHERE pb.Uid = ?
         ORDER BY pb.Pdate DESC`,
        [userId]
      );

      return purchases;
    } catch (error) {
      throw new Error(`Error fetching purchase history: ${error.message}`);
    }
  }

  static async getPurchaseById(purchaseId) {
    try {
      const [purchase] = await db.execute(
        `SELECT pb.*, b.Bname, b.Bimage, b.BAuthor, b.Bdescription
         FROM Purchase_Books pb
         JOIN Books b ON pb.Bid = b.Bid
         WHERE pb.Pid = ?`,
        [purchaseId]
      );

      return purchase[0] || null;
    } catch (error) {
      throw new Error(`Error fetching purchase: ${error.message}`);
    }
  }

  static async getOrderTotal(purchaseIds) {
    try {
      const placeholders = purchaseIds.map(() => '?').join(',');
      const [result] = await db.execute(
        `SELECT SUM(Pprice * Pquantity) as total FROM Purchase_Books WHERE Pid IN (${placeholders})`,
        purchaseIds
      );

      return result[0].total || 0;
    } catch (error) {
      throw new Error(`Error calculating order total: ${error.message}`);
    }
  }

  static async getAllPurchases() {
    try {
      const [purchases] = await db.execute(
        `SELECT pb.*, u.Ufirst_name, u.Ulast_name, u.Uemail, b.Bname 
         FROM Purchase_Books pb
         JOIN Users u ON pb.Uid = u.Uid
         JOIN Books b ON pb.Bid = b.Bid
         ORDER BY pb.Pdate DESC`
      );

      return purchases;
    } catch (error) {
      throw new Error(`Error fetching all purchases: ${error.message}`);
    }
  }
}

module.exports = Order;
