const API_URL = 'http://localhost:5000/api';

function guardAdmin() {
  if (!localStorage.getItem('ptp_token')) {
    window.location.href = '/admin/login.html';
  }
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('ptp_token')}`
  };
}

function logout() {
  localStorage.removeItem('ptp_token');
  window.location.href = '/admin/login.html';
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  });
}