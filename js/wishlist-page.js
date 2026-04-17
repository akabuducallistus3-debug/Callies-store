import { formatCurrency, showToast } from "./utils.js";
import { cart, wishlist } from "./cart.js";

/**
 * Wishlist Page Logic
 */

const init = () => {
  renderWishlist();
  updateBadges();
  setupTheme();
};

const renderWishlist = () => {
  const items = wishlist.getItems();
  const grid = document.getElementById("wishlist-grid");
  const emptyMessage = document.getElementById("empty-wishlist-message");

  if (items.length === 0) {
    grid.style.display = "none";
    emptyMessage.style.display = "block";
    return;
  }

  grid.style.display = "grid";
  emptyMessage.style.display = "none";

  grid.innerHTML = items
    .map(
      (product) => `
    <div class="product-card fade-in">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" class="product-image">
      </a>
      <div class="product-info">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="product-category">${product.category}</span>
          <button class="remove-wishlist-btn" data-id="${product.id}" style="color: var(--primary-color);">
            <i class="fas fa-heart"></i>
          </button>
        </div>
        <a href="product.html?id=${product.id}">
          <h3 class="product-name">${product.name}</h3>
        </a>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="product-price">${formatCurrency(product.price)}</span>
          <button class="add-to-cart-btn" data-id="${product.id}" style="padding: 0.5rem 1rem; border: 1px solid var(--primary-color); color: var(--primary-color); border-radius: 6px; font-weight: 600; font-size: 0.85rem;">Add to Cart</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  // Event Listeners
  grid.addEventListener("click", (e) => {
    const id = parseInt(e.target.closest("button")?.dataset.id);
    if (!id) return;

    const product = items.find((p) => p.id === id);

    if (e.target.closest(".remove-wishlist-btn")) {
      wishlist.toggleItem(product);
      renderWishlist();
      updateBadges();
    } else if (e.target.closest(".add-to-cart-btn")) {
      cart.addItem(product);
      updateBadges();
    }
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
  updateThemeIcon(currentTheme);

  themeToggle?.addEventListener("click", () => {
    const newTheme =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "dark"
        : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });
};

const updateThemeIcon = (theme) => {
  const icon = document.querySelector("#theme-toggle i");
  if (icon) {
    icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
  }
};

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("wishlistUpdated", updateBadges);
