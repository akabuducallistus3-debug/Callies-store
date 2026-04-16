import { formatCurrency, showToast } from "./utils.js";
import { cart, wishlist } from "../cart.js";

/**
 * Shopping Cart Page Logic
 */

const init = () => {
  renderCart();
  updateBadges();
  setupTheme();
};

const renderCart = () => {
  const items = cart.getItems();
  const cartList = document.getElementById("cart-items-list");
  const cartLayout = document.getElementById("cart-layout");
  const emptyMessage = document.getElementById("empty-cart-message");

  if (items.length === 0) {
    cartLayout.style.display = "none";
    emptyMessage.style.display = "block";
    return;
  }

  cartLayout.style.display = "grid";
  emptyMessage.style.display = "none";

  cartList.innerHTML = items
    .map(
      (item) => `
    <div class="cart-item fade-in" style="display: flex; gap: 1.5rem; background: var(--card-bg); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color); align-items: center;">
      <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
      <div style="flex: 1;">
        <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${item.name}</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">${item.category}</p>
        <span style="font-weight: 700; color: var(--primary-color);">${formatCurrency(item.price)}</span>
      </div>
      <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.25rem;">
        <button class="qty-btn decrease" data-id="${item.id}" style="padding: 0.5rem;"><i class="fas fa-minus"></i></button>
        <span style="padding: 0 1rem; font-weight: 600;">${item.quantity}</span>
        <button class="qty-btn increase" data-id="${item.id}" style="padding: 0.5rem;"><i class="fas fa-plus"></i></button>
      </div>
      <div style="text-align: right; min-width: 100px;">
        <p style="font-weight: 700; font-size: 1.1rem;">${formatCurrency(item.price * item.quantity)}</p>
        <button class="remove-btn" data-id="${item.id}" style="color: #ef4444; font-size: 0.9rem; margin-top: 0.5rem;">Remove</button>
      </div>
    </div>
  `,
    )
    .join("");

  // Update Summary
  const subtotal = cart.getTotal();
  document.getElementById("subtotal-price").textContent =
    formatCurrency(subtotal);
  document.getElementById("total-price").textContent = formatCurrency(subtotal);

  // Event Listeners
  cartList.addEventListener("click", (e) => {
    const id = parseInt(e.target.closest("button")?.dataset.id);
    if (!id) return;

    if (e.target.closest(".decrease")) {
      const item = items.find((i) => i.id === id);
      if (item.quantity > 1) cart.updateQuantity(id, item.quantity - 1);
      else cart.removeItem(id);
    } else if (e.target.closest(".increase")) {
      const item = items.find((i) => i.id === id);
      cart.updateQuantity(id, item.quantity + 1);
    } else if (e.target.closest(".remove-btn")) {
      cart.removeItem(id);
      showToast("Item removed from cart.");
    }
    renderCart();
  });
};

const updateBadges = () => {
  const cartCount = document.getElementById("cart-count");
  const wishlistCount = document.getElementById("wishlist-count");
  if (cartCount) cartCount.textContent = cart.getCount();
  if (wishlistCount) wishlistCount.textContent = wishlist.getItems().length;
};

const setupTheme = () => {
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);

  themeToggle?.addEventListener("click", () => {
    const newTheme =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "dark"
        : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
};

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("cartUpdated", updateBadges);
