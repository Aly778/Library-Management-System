// Main frontend JavaScript
console.log('Library Management System loaded');

// Initialize API Service with backend URL
const API_BASE_URL = 'http://localhost:5000/api';
apiService.baseURL = API_BASE_URL;

// Utility functions
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 4px;
    z-index: 1000;
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

function showError(message) {
  showAlert(message, 'error');
}

function showSuccess(message) {
  showAlert(message, 'success');
}

// Handle logout
function handleLogout() {
  authService.logout();
  window.location.href = '/login';
}

// Update UI based on authentication status
function updateAuthUI() {
  const isAuth = authService.isAuthenticated();
  const authLinks = document.getElementById('authLinks');
  
  if (isAuth) {
    // Show logged-in UI
    if (authLinks) {
      authLinks.innerHTML = `
        <a href="/dashboard">Dashboard</a>
        <button onclick="handleLogout()">Logout</button>
      `;
    }
  } else {
    // Show login/signup UI
    if (authLinks) {
      authLinks.innerHTML = `
        <a href="/login">Login</a>
        <a href="/signup">Sign Up</a>
      `;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
});
