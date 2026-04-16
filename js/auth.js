import { storage, showToast } from "./utils.js";

/**
 * Simulated Authentication Module
 */

const AUTH_KEY = "callies_store_user";
const USERS_KEY = "callies_store_users";

export const auth = {
  // Get current logged-in user
  getCurrentUser: () => {
    return storage.get(AUTH_KEY);
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!auth.getCurrentUser();
  },

  // Register a new user
  signup: (userData) => {
    const users = storage.get(USERS_KEY) || [];

    // Check if user already exists
    if (users.find((u) => u.email === userData.email)) {
      showToast("User with this email already exists.", "error");
      return false;
    }

    // Add new user
    users.push(userData);
    storage.set(USERS_KEY, users);

    // Automatically log in
    auth.login(userData.email, userData.password);
    showToast("Account created successfully!");
    return true;
  },

  // Log in a user
  login: (email, password) => {
    const users = storage.get(USERS_KEY) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      storage.set(AUTH_KEY, userWithoutPassword);
      showToast(`Welcome back, ${user.name}!`);
      return true;
    } else {
      showToast("Invalid email or password.", "error");
      return false;
    }
  },

  // Log out a user
  logout: () => {
    storage.remove(AUTH_KEY);
    showToast("Logged out successfully.");
    window.location.reload();
  },

  // Update user profile
  updateProfile: (updatedData) => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return false;

    const users = storage.get(USERS_KEY) || [];
    const userIndex = users.findIndex((u) => u.email === currentUser.email);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      storage.set(USERS_KEY, users);

      const { password, ...userWithoutPassword } = users[userIndex];
      storage.set(AUTH_KEY, userWithoutPassword);
      return true;
    }
    return false;
  },
};
