const db = require('../config/db');

class Cart {
  constructor() {
    this.items = [];
  }

  // In-memory cart operations (can be extended to database)
  addItem(bookId, quantity = 1) {
    const existingItem = this.items.find(item => item.Bid === bookId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ Bid: bookId, quantity });
    }

    return this.items;
  }

  removeItem(bookId) {
    this.items = this.items.filter(item => item.Bid !== bookId);
    return this.items;
  }

  updateQuantity(bookId, quantity) {
    const item = this.items.find(item => item.Bid === bookId);
    if (item) {
      item.quantity = Math.max(quantity, 1);
    }
    return this.items;
  }

  clear() {
    this.items = [];
    return this.items;
  }

  getItems() {
    return this.items;
  }

  async getCartWithDetails() {
    try {
      const itemsWithDetails = [];

      for (const item of this.items) {
        const [books] = await db.execute(
          'SELECT * FROM Books WHERE Bid = ?',
          [item.Bid]
        );

        if (books[0]) {
          itemsWithDetails.push({
            ...books[0],
            cartQuantity: item.quantity,
            subtotal: books[0].Bprice * item.quantity
          });
        }
      }

      return itemsWithDetails;
    } catch (error) {
      throw new Error(`Error getting cart details: ${error.message}`);
    }
  }

  async getTotal() {
    try {
      const items = await this.getCartWithDetails();
      return items.reduce((total, item) => total + item.subtotal, 0);
    } catch (error) {
      throw new Error(`Error calculating total: ${error.message}`);
    }
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

module.exports = Cart;
