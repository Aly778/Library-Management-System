// Cart Service - Client-side cart management
class CartService {
  constructor() {
    this.cart = this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  addItem(bookId, bookData, quantity = 1) {
    const existingItem = this.cart.find(item => item.Bid === bookId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        Bid: bookId,
        Bname: bookData.Bname,
        Bprice: bookData.Bprice,
        Bimage: bookData.Bimage,
        quantity: quantity
      });
    }

    this.saveCart();
    return this.cart;
  }

  removeItem(bookId) {
    this.cart = this.cart.filter(item => item.Bid !== bookId);
    this.saveCart();
    return this.cart;
  }

  updateQuantity(bookId, quantity) {
    const item = this.cart.find(item => item.Bid === bookId);
    if (item) {
      item.quantity = Math.max(quantity, 1);
      this.saveCart();
    }
    return this.cart;
  }

  clear() {
    this.cart = [];
    this.saveCart();
    return this.cart;
  }

  getItems() {
    return this.cart;
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.Bprice * item.quantity), 0);
  }

  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  isEmpty() {
    return this.cart.length === 0;
  }

  getSubtotal(bookId) {
    const item = this.cart.find(item => item.Bid === bookId);
    return item ? item.Bprice * item.quantity : 0;
  }
}

// Create singleton instance
const cartService = new CartService();
