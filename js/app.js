import {
  fetchProducts,
  formatCurrency,
  debounce,
  showToast,
  getProductImageUrl,
  getImageFallbackUrl,
} from "./utils.js";
import { cart, wishlist } from "./cart.js";
import { auth } from "./auth.js";

/**
 * Main Application Logic
 */

let allProducts = [];
let filteredProducts = [];

// Initialize the app
const init = async () => {
  setupTheme();
  updateBadges();
  setupEventListeners();

  // Load products if on home page
  const productGrid = document.getElementById("product-grid");
  if (productGrid) {
    allProducts = await fetchProducts();
    filteredProducts = [...allProducts];
    renderProducts(filteredProducts);
  }
};

// Theme Toggle Logic
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

// Update Cart and Wishlist Badges
const updateBadges = () => {
  const cartCount = document.getElementById("cart-count");
  const wishlistCount = document.getElementById("wishlist-count");

  if (cartCount) cartCount.textContent = cart.getCount();
  if (wishlistCount) wishlistCount.textContent = wishlist.getItems().length;
};

// Render Products to Grid
const renderProducts = (products) => {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  if (products.length === 0) {
    productGrid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">No products found matching your criteria.</p>';
    return;
  }

  productGrid.innerHTML = products
    .map(
      (product) => `
    <div class="product-card fade-in">
      <a href="product.html?id=${product.id}">
        <img src="${getProductImageUrl(product)}" alt="${product.name}" class="product-image" loading="lazy" onerror="this.onerror=null;this.src='${getImageFallbackUrl(product)}';">
      </a>
      <div class="product-info">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="product-category">${product.category}</span>
          <button class="wishlist-btn" data-id="${product.id}" style="color: ${wishlist.isInWishlist(product.id) ? "var(--primary-color)" : "var(--text-muted)"};">
            <i class="${wishlist.isInWishlist(product.id) ? "fas" : "far"} fa-heart"></i>
          </button>
        </div>
        <a href="product.html?id=${product.id}">
          <h3 class="product-name">${product.name}</h3>
        </a>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="product-price">${formatCurrency(product.price)}</span>
          <div style="font-size: 0.85rem; color: #fbbf24;">
            <i class="fas fa-star"></i> ${product.rating}
          </div>
        </div>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `,
    )
    .join("");

  // Add event listeners to buttons using event delegation
  productGrid.addEventListener("click", (e) => {
    const addToCartBtn = e.target.closest(".add-to-cart-btn");
    const wishlistBtn = e.target.closest(".wishlist-btn");

    if (addToCartBtn) {
      const id = parseInt(addToCartBtn.dataset.id);
      const product = allProducts.find((p) => p.id === id);
      if (product) cart.addItem(product);
    }

    if (wishlistBtn) {
      const id = parseInt(wishlistBtn.dataset.id);
      const product = allProducts.find((p) => p.id === id);
      if (product) {
        wishlist.toggleItem(product);
        updateBadges();
        renderProducts(filteredProducts); // Re-render to update heart icon
      }
    }
  });
};

// Setup Event Listeners
const setupEventListeners = () => {
  // Search functionality
  const searchInput = document.getElementById("search-input");
  searchInput?.addEventListener(
    "input",
    debounce((e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterAndSortProducts(
        searchTerm,
        document.getElementById("category-filter").value,
        document.getElementById("sort-filter").value,
      );
    }, 300),
  );

  // Category filter
  const categoryFilter = document.getElementById("category-filter");
  categoryFilter?.addEventListener("change", (e) => {
    filterAndSortProducts(
      document.getElementById("search-input").value,
      e.target.value,
      document.getElementById("sort-filter").value,
    );
  });

  // Sort filter
  const sortFilter = document.getElementById("sort-filter");
  sortFilter?.addEventListener("change", (e) => {
    filterAndSortProducts(
      document.getElementById("search-input").value,
      document.getElementById("category-filter").value,
      e.target.value,
    );
  });

  // Newsletter form
  const newsletterForm = document.getElementById("newsletter-form");
  newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Thanks for subscribing!");
    newsletterForm.reset();
  });

  // Listen for cart updates
  window.addEventListener("cartUpdated", updateBadges);
};

// Filter and Sort Logic
const filterAndSortProducts = (search, category, sort) => {
  filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  renderProducts(filteredProducts);
};

// Start the app
document.addEventListener("DOMContentLoaded", init);
