import { formatCurrency, showToast } from './utils.js';
import { cart, wishlist } from './cart.js';
import { auth } from './auth.js';

/**
 * Checkout Page Logic
 */

const init = () => {
  const items = cart.getItems();
  if (items.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderOrderSummary(items);
  setupCheckoutForm();
  updateBadges();
  setupTheme();
  
  // Pre-fill form if user is logged in
  const user = auth.getCurrentUser();
  if (user) {
    document.getElementById('full-name').value = user.name;
    document.getElementById('email').value = user.email;
  }
};

const renderOrderSummary = (items) => {
  const itemsList = document.getElementById('checkout-items-list');
  const subtotal = cart.getTotal();

  itemsList.innerHTML = items.map(item => `
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        <div>
          <h4 style="font-size: 0.9rem; font-weight: 600;">${item.name}</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Qty: ${item.quantity}</p>
        </div>
      </div>
      <span style="font-weight: 600;">${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('');

  document.getElementById('subtotal-price').textContent = formatCurrency(subtotal);
  document.getElementById('total-price').textContent = formatCurrency(subtotal);
};

const setupCheckoutForm = () => {
  const form = document.getElementById('checkout-form');
  const layout = document.getElementById('checkout-layout');
  const successMessage = document.getElementById('success-message');
  const orderIdSpan = document.getElementById('order-id');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate order processing
    showToast('Processing your order...', 'info');
    
    setTimeout(() => {
      const orderId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      orderIdSpan.textContent = orderId;
      
      layout.style.display = 'none';
      successMessage.style.display = 'block';
      
      cart.clear();
      showToast('Order placed successfully!');
    }, 1500);
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
