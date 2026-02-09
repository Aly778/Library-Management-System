// API Service - Handles all backend communication
class ApiService {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Books endpoints
  async getBooks(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/admin/books/public/all?${params}`, { method: 'GET' });
  }

  async getCategories() {
    return this.request('/admin/books/public/categories', { method: 'GET' });
  }

  async getBookById(bookId) {
    return this.request(`/admin/books/${bookId}`, { method: 'GET' });
  }

  async createBook(bookData) {
    return this.request('/admin/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  }

  async updateBook(bookId, bookData) {
    return this.request(`/admin/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
  }

  async deleteBook(bookId) {
    return this.request(`/admin/books/${bookId}`, { method: 'DELETE' });
  }

  // Customer endpoints
  async getPurchaseHistory() {
    return this.request('/customer/purchases', { method: 'GET' });
  }

  async getBorrowHistory() {
    return this.request('/customer/borrows', { method: 'GET' });
  }

  async borrowBook(bookId, borrowDays = 14) {
    return this.request('/customer/borrow', {
      method: 'POST',
      body: JSON.stringify({ bookId, borrowDays })
    });
  }

  async returnBook(borrowId) {
    return this.request(`/customer/return/${borrowId}`, { method: 'POST' });
  }

  async purchaseBooks(items) {
    return this.request('/customer/purchase', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
  }

  // Category endpoints
  // Note: getCategories is defined above with public endpoint
}


// Create singleton instance
const apiService = new ApiService();
