/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

// Base API URL - Update this with your backend URL
export const API_BASE_URL = 'http://185.193.19.10:8000';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  ADMIN_SIGN_IN: `${API_BASE_URL}/admin/sign-in`,
};

// Content endpoints
export const CONTENT_ENDPOINTS = {
  MOVIES: `${API_BASE_URL}/content/movies`,
  SHOWS: `${API_BASE_URL}/content/shows`,
  SECTIONS: `${API_BASE_URL}/content/sections`,
};

// API Headers
export const API_HEADERS = {
  'Content-Type': 'application/json',
};

// Device info headers (optional)
export const getDeviceHeaders = (deviceId?: string, deviceModel?: string, platform?: string) => ({
  ...(deviceId && { 'x-device-id': deviceId }),
  ...(deviceModel && { 'x-device-model': deviceModel }),
  ...(platform && { 'x-device-platform': platform }),
});
