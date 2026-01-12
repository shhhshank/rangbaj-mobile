/**
 * Axios Interceptor
 * Adds authentication token to requests and handles token refresh
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from '@/services/authService';
import { store } from '@/redux/store';
import { logout, setToken } from '@/redux/slices/authSlice';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Setup axios interceptors for authentication
 */
export const setupAxiosInterceptors = () => {
  // Request interceptor - Add auth token to headers
  axios.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Don't add token to auth endpoints (send-otp, verify-otp, refresh-token, admin-sign-in)
      const isAuthEndpoint = config.url?.includes('/auth/send-otp') || 
                             config.url?.includes('/auth/verify-otp') ||
                             config.url?.includes('/auth/refresh-token') ||
                             config.url?.includes('/admin/sign-in');
      
      if (isAuthEndpoint) {
        console.log('[AxiosInterceptor] Skipping auth token for auth endpoint:', config.url);
        return config;
      }
      
      const token = await AsyncStorage.getItem('@rangbaj_access_token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[AxiosInterceptor] Added auth token to request:', config.url);
      } else {
        console.log('[AxiosInterceptor] No auth token available for request:', config.url);
      }
      
      return config;
    },
    (error) => {
      console.error('[AxiosInterceptor] Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle token refresh on 401
  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // If error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log('[AxiosInterceptor] 401 error detected, attempting token refresh');
        
        if (isRefreshing) {
          // If already refreshing, queue this request
          console.log('[AxiosInterceptor] Token refresh in progress, queuing request');
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await AsyncStorage.getItem('@rangbaj_refresh_token');
          
          if (!refreshToken) {
            console.error('[AxiosInterceptor] No refresh token available');
            throw new Error('No refresh token available');
          }

          console.log('[AxiosInterceptor] Refreshing access token...');
          
          // Refresh the token
          const response = await refreshAccessToken(refreshToken);
          const newAccessToken = response.access_token;

          // Validate we got a valid token
          if (!newAccessToken || typeof newAccessToken !== 'string') {
            console.error('[AxiosInterceptor] Invalid token received:', newAccessToken);
            throw new Error('Invalid access token received from refresh');
          }

          console.log('[AxiosInterceptor] Token refresh successful, new token length:', newAccessToken.length);

          // Store new access token in AsyncStorage
          await AsyncStorage.setItem('@rangbaj_access_token', newAccessToken);
          
          // Update Redux state with new token
          store.dispatch(setToken(newAccessToken));

          // Update the failed requests with new token
          processQueue(null, newAccessToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear auth data and redirect to login
          processQueue(refreshError, null);
          
          console.error('[AxiosInterceptor] Token refresh failed:', refreshError);
          console.log('[AxiosInterceptor] Logging out user due to refresh failure');
          
          // Dispatch logout action to clear Redux state and AsyncStorage
          store.dispatch(logout());
          
          // Note: Navigation to login screen will be handled by the app's
          // auth state listener in _layout.tsx or by the user manually
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
