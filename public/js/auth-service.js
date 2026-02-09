// Authentication Service
class AuthService {
  constructor() {
    this.user = null;
    this.token = localStorage.getItem('authToken');
    this.loadUser();
  }

  async register(userData) {
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        return { success: true, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async login(email, password) {
    try {
      const response = await apiService.login(email, password);
      if (response.success && response.token) {
        this.setToken(response.token);
        // Store user info from response (includes firstName, lastName)
        if (response.user) {
          this.user = response.user;
          localStorage.setItem('user', JSON.stringify(this.user));
        } else {
          this.decodeAndSetUser();
        }
        return { success: true, message: 'Login successful' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  decodeAndSetUser() {
    if (this.token) {
      const payload = this.token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      this.user = {
        userId: decoded.userId,
        role: decoded.role
      };
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }

  loadUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  isAdmin() {
    return this.user?.role?.toLowerCase() === 'admin';
  }

  isSuperAdmin() {
    return this.user?.role?.toLowerCase() === 'superadmin';
  }

  isCustomer() {
    return this.user?.role?.toLowerCase() === 'customer';
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  redirectIfNotAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  }

  redirectIfNotAdmin() {
    if (!this.isAuthenticated() || !this.isAdmin()) {
      window.location.href = '/';
      return false;
    }
    return true;
  }
}

// Create singleton instance
const authService = new AuthService();
