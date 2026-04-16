import { auth } from './auth.js';
import { cart, wishlist } from './cart.js';

/**
 * Authentication Page Logic
 */

const init = () => {
  setupAuthUI();
  updateBadges();
  setupTheme();
};

const setupAuthUI = () => {
  const loginContainer = document.getElementById('login-form-container');
  const signupContainer = document.getElementById('signup-form-container');
  const profileContainer = document.getElementById('profile-container');
  
  const showSignupBtn = document.getElementById('show-signup');
  const showLoginBtn = document.getElementById('show-login');
  
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const logoutBtn = document.getElementById('logout-btn');

  // Check if user is already logged in
  const user = auth.getCurrentUser();
  if (user) {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'none';
    profileContainer.style.display = 'block';
    
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
  }

  // Toggle between Login and Signup
  showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
  });

  showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
  });

  // Handle Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (auth.login(email, password)) {
      window.location.href = 'index.html';
    }
  });

  // Handle Signup
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    if (auth.signup({ name, email, password })) {
      window.location.href = 'index.html';
    }
  });

  // Handle Logout
  logoutBtn.addEventListener('click', () => {
    auth.logout();
  });
};

const updateBadges = () => {
  const cartCount = document.getElementById('cart-count');
  const wishlistCount = document.getElementById('wishlist-count');
  if (cartCount) cartCount.textContent = cart.getCount();
  if (wishlistCount) wishlistCount.textContent = wishlist.getItems().length;
};

const setupTheme = () => {
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggle?.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
};

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('cartUpdated', updateBadges);
