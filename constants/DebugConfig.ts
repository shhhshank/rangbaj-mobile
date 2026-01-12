/**
 * Debug Configuration
 * Enable/disable debug features for testing
 * 
 * IMPORTANT: Set all to false in production!
 */

export const DEBUG_CONFIG = {
  // Enable to test token refresh after 15 seconds instead of 15 minutes
  FAST_TOKEN_EXPIRY: __DEV__ && false, // Set to true to enable fast expiry for testing
  
  // Token expiry time in milliseconds
  TOKEN_EXPIRY_TIME: __DEV__ && false ? 15 * 1000 : 15 * 60 * 1000, // 15 seconds vs 15 minutes
  
  // Enable detailed auth logging
  VERBOSE_AUTH_LOGS: __DEV__ && false, // Set to true for verbose logging
  
  // Show auth debug panel
  SHOW_AUTH_DEBUG_PANEL: __DEV__ && false, // Set to true to show debug panel
};

// Helper to log debug info
export const debugLog = (message: string, ...args: any[]) => {
  if (DEBUG_CONFIG.VERBOSE_AUTH_LOGS) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

// Helper to get token expiry message
export const getTokenExpiryMessage = () => {
  if (DEBUG_CONFIG.FAST_TOKEN_EXPIRY) {
    return '⚠️ DEBUG MODE: Tokens will expire in 15 seconds for testing';
  }
  return 'Tokens will expire in 15 minutes (production mode)';
};
