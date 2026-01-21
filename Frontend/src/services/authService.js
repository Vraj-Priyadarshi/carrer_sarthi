import api from './api';

const TOKEN_KEY = 'skillpath_token';
const USER_KEY = 'skillpath_user';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { email, password, firstName, lastName }
   * @returns {Promise} - MessageResponse
   */
  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  },

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise} - AuthResponse with JWT token
   */
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const data = response.data;
    
    // Store token and user data
    if (data.accessToken) {
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify({
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isVerified: data.isVerified,
      }));
    }
    
    return data;
  },

  /**
   * Logout user - clear all auth data from localStorage and cookies
   */
  logout: () => {
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Clear any other stored data
    localStorage.removeItem('skillpath_onboarding');
    
    // Clear all cookies (including JWT if stored in cookies)
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    // Clear sessionStorage as well
    sessionStorage.clear();
  },

  /**
   * Verify email with token
   * @param {string} token - Email verification token
   * @returns {Promise} - MessageResponse
   */
  verifyEmail: async (token) => {
    const response = await api.get(`/api/auth/verify?token=${token}`);
    return response.data;
  },

  /**
   * Request password reset
   * @param {string} email
   * @returns {Promise} - MessageResponse
   */
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Validate password reset token
   * @param {string} token
   * @returns {Promise} - MessageResponse
   */
  validateResetToken: async (token) => {
    const response = await api.get(`/api/auth/validate-reset-token?token=${token}`);
    return response.data;
  },

  /**
   * Reset password with token
   * @param {string} token
   * @param {string} newPassword
   * @returns {Promise} - MessageResponse
   */
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  },

  /**
   * Get stored JWT token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored user data
   * @returns {Object|null}
   */
  getUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Check if user is authenticated (has valid token)
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    
    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  /**
   * Initiate Google OAuth login
   * Redirects to backend OAuth endpoint
   */
  loginWithGoogle: () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/google`;
  },
};

export default authService;
