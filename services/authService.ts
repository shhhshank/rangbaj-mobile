/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import axios, { AxiosError } from 'axios';
import { AUTH_ENDPOINTS, API_HEADERS, getDeviceHeaders } from '@/constants/Api';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Types
export interface SendOtpRequest {
  phone: string;
  channel?: 'sms' | 'whatsapp';
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  status: number;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface User {
  _id: string;
  phone: string;
  is_phone_verified: boolean;
  name?: string;
  email?: string;
}

export interface VerifyOtpResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
  message: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
}

/**
 * Normalize phone number to E.164 format
 * Accepts: +919876543210, 919876543210, 9876543210
 * Returns: +919876543210
 */
export const normalizePhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const numericPhone = phone.replace(/[^0-9]/g, '');
  
  // If it's a 10-digit number, add +91
  if (numericPhone.length === 10) {
    return `+91${numericPhone}`;
  }
  
  // If it starts with 91 and has 12 digits, add +
  if (numericPhone.length === 12 && numericPhone.startsWith('91')) {
    return `+${numericPhone}`;
  }
  
  // If it already has country code
  if (numericPhone.length === 12) {
    return `+${numericPhone}`;
  }
  
  // Return as is with + if not already present
  return phone.startsWith('+') ? phone : `+${numericPhone}`;
};

/**
 * Validate Indian phone number
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const numericPhone = phone.replace(/[^0-9]/g, '');
  
  // Check if it's a 10-digit number starting with 6-9
  if (numericPhone.length === 10) {
    return /^[6-9]\d{9}$/.test(numericPhone);
  }
  
  // Check if it's a 12-digit number starting with 91
  if (numericPhone.length === 12) {
    return /^91[6-9]\d{9}$/.test(numericPhone);
  }
  
  return false;
};

/**
 * Get device information for headers
 */
const getDeviceInfo = () => {
  return {
    deviceModel: Device.modelName || 'Unknown',
    platform: Platform.OS,
  };
};

/**
 * Send OTP to phone number
 */
export const sendOtp = async (
  phone: string,
  channel: 'sms' | 'whatsapp' = 'sms'
): Promise<SendOtpResponse> => {
  try {
    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone);
    
    console.log('[AuthService] Sending OTP to:', normalizedPhone);
    console.log('[AuthService] API Endpoint:', AUTH_ENDPOINTS.SEND_OTP);
    
    // Validate phone number
    if (!validatePhoneNumber(normalizedPhone)) {
      throw {
        message: 'Please enter a valid Indian mobile number',
        status: 400,
      } as ApiError;
    }
    
    const deviceInfo = getDeviceInfo();
    
    const response = await axios.post<SendOtpResponse>(
      AUTH_ENDPOINTS.SEND_OTP,
      {
        phone: normalizedPhone,
      },
      {
        headers: {
          ...API_HEADERS,
          ...getDeviceHeaders(undefined, deviceInfo.deviceModel, deviceInfo.platform),
          'x-channel': channel,
        },
        timeout: 30000, // 30 second timeout
      }
    );
    
    console.log('[AuthService] OTP sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[AuthService] Send OTP Error:', error);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      
      // Log detailed error information
      console.error('[AuthService] Axios Error Details:', {
        message: axiosError.message,
        code: axiosError.code,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
      });
      
      // Network error (no response)
      if (!axiosError.response) {
        throw {
          message: `Network error: ${axiosError.message}. Please check your internet connection.`,
          status: 0,
        } as ApiError;
      }
      
      throw {
        message: axiosError.response?.data?.message || 'Failed to send OTP',
        status: axiosError.response?.status || 500,
      } as ApiError;
    }
    throw error;
  }
};

/**
 * Verify OTP and login
 */
export const verifyOtp = async (
  phone: string,
  otp: string
): Promise<VerifyOtpResponse> => {
  try {
    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone);
    
    // Validate OTP
    if (!/^\d{6}$/.test(otp)) {
      throw {
        message: 'Please enter a valid 6-digit OTP',
        status: 400,
      } as ApiError;
    }
    
    const deviceInfo = getDeviceInfo();
    
    const response = await axios.post<VerifyOtpResponse>(
      AUTH_ENDPOINTS.VERIFY_OTP,
      {
        phone: normalizedPhone,
        otp,
      },
      {
        headers: {
          ...API_HEADERS,
          ...getDeviceHeaders(undefined, deviceInfo.deviceModel, deviceInfo.platform),
        },
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw {
        message: axiosError.response?.data?.message || 'Invalid or expired OTP',
        status: axiosError.response?.status || 401,
      } as ApiError;
    }
    throw error;
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ access_token: string }> => {
  try {
    console.log('[AuthService] Refreshing token with:', refreshToken.substring(0, 20) + '...');
    
    const response = await axios.post(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      {
        refresh_token: refreshToken,
      },
      {
        headers: API_HEADERS,
      }
    );
    
    console.log('[AuthService] Refresh response:', JSON.stringify(response.data));
    
    // Handle nested response structure: { data: { access_token: "..." } }
    const accessToken = response.data?.data?.access_token || response.data?.access_token;
    
    // Validate response has access_token
    if (!accessToken) {
      console.error('[AuthService] Invalid refresh response - missing access_token');
      console.error('[AuthService] Response structure:', response.data);
      throw {
        message: 'Invalid refresh token response - missing access_token',
        status: 500,
      } as ApiError;
    }
    
    console.log('[AuthService] Access token extracted successfully');
    
    // Return in expected format
    return { access_token: accessToken };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      console.error('[AuthService] Refresh token error:', axiosError.response?.data || axiosError.message);
      throw {
        message: axiosError.response?.data?.message || 'Failed to refresh token',
        status: axiosError.response?.status || 401,
      } as ApiError;
    }
    console.error('[AuthService] Unexpected refresh error:', error);
    throw error;
  }
};
