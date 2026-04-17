import {
  fetchProducts,
  formatCurrency,
  getUrlParam,
  showToast,
} from "./utils.js";
import { cart, wishlist } from "../cart.js";

/**
 * Product Details Page Logic
 */

const init = async () => {
  const productId = parseInt(getUrlParam("id"));
  if (!productId) {
    window.location.href = "index.html";
    return;
  }

  const allProducts = await fetchProducts();
  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    window.location.href = "index.html";
    return;
  }

  renderProductDetails(product);
  renderRelatedProducts(product, allProducts);
  updateBadges();
  setupTheme();
};

const renderProductDetails = (product) => {
  const container = document.getElementById("product-details");
  if (!container) return;

  container.innerHTML = `
    <div class="product-image-gallery fade-in">
      <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 16px; box-shadow: var(--shadow);">
    </div>
    <div class="product-info-details fade-in" style="animation-delay: 0.2s;">
      <span class="product-category" style="font-size: 1rem;">${product.category}</span>
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${product.name}</h1>
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
        <span class="product-price" style="font-size: 2rem;">${formatCurrency(product.price)}</span>
        <div style="color: #fbbf24; font-size: 1.1rem;">
          <i class="fas fa-star"></i> ${product.rating} (120 reviews)
        </div>
      </div>
      <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2.5rem; line-height: 1.8;">
        ${product.description}
      </p>
      
      <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.5rem;">
          <button id="decrease-qty" style="padding: 0.5rem 1rem;"><i class="fas fa-minus"></i></button>
          <span id="quantity" style="padding: 0 1rem; font-weight: 600;">1</span>
          <button id="increase-qty" style="padding: 0.5rem 1rem;"><i class="fas fa-plus"></i></button>
        </div>
        <button id="add-to-cart-btn" class="btn btn-primary" style="flex: 1; padding: 1rem;">Add to Cart</button>
        <button id="wishlist-btn" class="icon-btn" style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0 1.5rem; color: ${wishlist.isInWishlist(product.id) ? "var(--primary-color)" : "var(--text-muted)"};">
          <i class="${wishlist.isInWishlist(product.id) ? "fas" : "far"} fa-heart"></i>
        </button>
      </div>

      <div style="border-top: 1px solid var(--border-color); padding-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <i class="fas fa-truck" style="color: var(--primary-color);"></i>
          <div>
            <h4 style="font-size: 0.9rem;">Free Shipping</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">On orders over $50</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <i class="fas fa-undo" style="color: var(--primary-color);"></i>
          <div>
            <h4 style="font-size: 0.9rem;">Easy Returns</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Quantity controls
  let qty = 1;
  const qtyDisplay = document.getElementById("quantity");
  document.getElementById("decrease-qty").addEventListener("click", () => {
    if (qty > 1) {
      qty--;
      qtyDisplay.textContent = qty;
    }
  });
  document.getElementById("increase-qty").addEventListener("click", () => {
    qty++;
    qtyDisplay.textContent = qty;
  });

  // Add to cart
  document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    cart.addItem(product, qty);
    updateBadges();
  });

  // Wishlist toggle
  document.getElementById("wishlist-btn").addEventListener("click", (e) => {
    wishlist.toggleItem(product);
    const btn = e.currentTarget;
    const icon = btn.querySelector("i");
    const isIn = wishlist.isInWishlist(product.id);
    btn.style.color = isIn ? "var(--primary-color)" : "var(--text-muted)";
    icon.className = isIn ? "fas fa-heart" : "far fa-heart";
    updateBadges();
  });
};

const renderRelatedProducts = (currentProduct, allProducts) => {
  const container = document.getElementById("related-products");
  if (!container) return;

  const related = allProducts
    .filter(
      (p) =>
        p.category === currentProduct.category && p.id !== currentProduct.id,
    )
    .slice(0, 4);

  if (related.length === 0) {
    container.parentElement.style.display = "none";
    return;
  }

  container.innerHTML = related
    .map(
      (product) => `
    <div class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" class="product-image">
      </a>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <a href="product.html?id=${product.id}">
          <h3 class="product-name">${product.name}</h3>
        </a>
        <span class="product-price">${formatCurrency(product.price)}</span>
      </div>
    </div>
  `,
    )
    .join("");
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
window.addEventListener("cartUpdated", updateBadges);
