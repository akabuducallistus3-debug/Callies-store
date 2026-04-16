import { storage, showToast } from "./utils.js";

/**
 * Shopping Cart and Wishlist Module
 */

const CART_KEY = "callies_store_cart";
const WISHLIST_KEY = "callies_store_wishlist";

export const cart = {
  // Get all items in the cart
  getItems: () => {
    return storage.get(CART_KEY) || [];
  },

  // Add an item to the cart
  addItem: (product, quantity = 1) => {
    const items = cart.getItems();
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ ...product, quantity });
    }

    storage.set(CART_KEY, items);
    showToast(`${product.name} added to cart!`);

    // Dispatch custom event to update UI
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  },

  // Remove an item from the cart
  removeItem: (productId) => {
    const items = cart.getItems();
    const updatedItems = items.filter((item) => item.id !== productId);
    storage.set(CART_KEY, updatedItems);

    window.dispatchEvent(new CustomEvent("cartUpdated"));
  },

  // Update quantity of an item
  updateQuantity: (productId, quantity) => {
    const items = cart.getItems();
    const item = items.find((item) => item.id === productId);

    if (item) {
      item.quantity = Math.max(1, quantity);
      storage.set(CART_KEY, items);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  },

  // Get total price of items in the cart
  getTotal: () => {
    const items = cart.getItems();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // Get total count of items in the cart
  getCount: () => {
    const items = cart.getItems();
    return items.reduce((count, item) => count + item.quantity, 0);
  },

  // Clear the cart
  clear: () => {
    storage.remove(CART_KEY);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  },
};

export const wishlist = {
  // Get all items in the wishlist
  getItems: () => {
    return storage.get(WISHLIST_KEY) || [];
  },

  // Toggle an item in the wishlist
  toggleItem: (product) => {
    const items = wishlist.getItems();
    const index = items.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      items.splice(index, 1);
      showToast(`${product.name} removed from wishlist.`);
    } else {
      items.push(product);
      showToast(`${product.name} added to wishlist!`);
    }

    storage.set(WISHLIST_KEY, items);
    window.dispatchEvent(new CustomEvent("wishlistUpdated"));
  },

  // Check if an item is in the wishlist
  isInWishlist: (productId) => {
    const items = wishlist.getItems();
    return items.some((item) => item.id === productId);
  },
};
