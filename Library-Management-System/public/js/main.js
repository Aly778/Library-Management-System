// Main frontend JavaScript
console.log('Library Management System loaded');

// Initialize API Service with backend URL
const API_BASE_URL = 'http://localhost:5000/api';
if (typeof apiService !== 'undefined') {
  apiService.baseURL = API_BASE_URL;
}

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

/**
 * FIXED: Handle logout to clear storage and redirect to login
 */
function handleLogout() {
  // 1. Clear all authentication data from localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // 2. Clear any service-level auth states if authService is present
  if (typeof authService !== 'undefined') {
    authService.logout();
  }
  
  // 3. Force redirect to the login page
  window.location.href = '/login';
}
/**
 * FIXED: Update UI to remove redundant Dashboard/Catalog buttons from Login header
 */
function updateAuthUI() {
  const authToken = localStorage.getItem('authToken');
  const authLinks = document.getElementById('authLinks');
  const currentPath = window.location.pathname;
  
  if (!authLinks) return;

  // If we are on the login or signup page, show only specific links
  if (currentPath === '/login' || currentPath === '/signup') {
    authLinks.innerHTML = `
      <a href="/login" class="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">Login</a>
      <a href="/signup" class="flex min-w-[84px] items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors">
        <span>Sign Up</span>
      </a>
    `;
    return;
  }

  if (authToken) {
    // Show only relevant links based on role for logged-in users
    authLinks.innerHTML = `
      <button onclick="handleLogout()" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors flex items-center gap-2">
        <span class="material-symbols-outlined text-[20px]">logout</span> Logout
      </button>
    `;
  } else {
    // Basic landing page links
    authLinks.innerHTML = `
      <a href="/login" class="text-sm font-medium hover:text-primary transition-colors">Login</a>
      <a href="/signup" class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Sign Up</a>
    `;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
});