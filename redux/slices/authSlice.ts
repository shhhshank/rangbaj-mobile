import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';
import { sendOtp, verifyOtp, User, ApiError } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  otpStatus: 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'failed';
  error: string | null;
  isAuthenticated: boolean;
  tokenIssuedAt: number | null; // Timestamp when token was issued
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  status: 'idle',
  otpStatus: 'idle',
  error: null,
  isAuthenticated: false,
  tokenIssuedAt: null,
};

// Admin login (email/password)
export const fetchAuthToken = createAsyncThunk<
  string,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/fetchAuthToken',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://185.193.19.10:8000/admin/sign-in', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data && response.data.data && response.data.data.accessToken) {
        return response.data.data.accessToken;
      } else {
        return rejectWithValue('Invalid response from server');
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Network error');
    }
  }
);

// Send OTP to phone number
export const sendOtpAsync = createAsyncThunk<
  { message: string },
  { phone: string; channel?: 'sms' | 'whatsapp' },
  { rejectValue: string }
>(
  'auth/sendOtp',
  async ({ phone, channel = 'sms' }, { rejectWithValue }) => {
    try {
      const response = await sendOtp(phone, channel);
      return { message: response.message };
    } catch (err: any) {
      const error = err as ApiError;
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

// Verify OTP and login
export const verifyOtpAsync = createAsyncThunk<
  { accessToken: string; refreshToken: string; user: User },
  { phone: string; otp: string },
  { rejectValue: string }
>(
  'auth/verifyOtp',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const response = await verifyOtp(phone, otp);
      
      // Store tokens in AsyncStorage
      await AsyncStorage.setItem('@rangbaj_access_token', response.data.access_token);
      await AsyncStorage.setItem('@rangbaj_refresh_token', response.data.refresh_token);
      await AsyncStorage.setItem('@rangbaj_user', JSON.stringify(response.data.user));
      
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        user: response.data.user,
      };
    } catch (err: any) {
      const error = err as ApiError;
      return rejectWithValue(error.message || 'Invalid or expired OTP');
    }
  }
);

// Load auth from storage
export const loadAuthFromStorage = createAsyncThunk<
  { accessToken: string; refreshToken: string; user: User } | null,
  void,
  { rejectValue: string }
>(
  'auth/loadFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem('@rangbaj_access_token');
      const refreshToken = await AsyncStorage.getItem('@rangbaj_refresh_token');
      const userJson = await AsyncStorage.getItem('@rangbaj_user');
      
      // User is logged in if refresh token and user exist
      // Access token can be missing (expired) - it will be refreshed on next API call
      if (refreshToken && userJson) {
        const user = JSON.parse(userJson) as User;
        console.log('[AuthSlice] Loading auth from storage:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          user: user.phone
        });
        return { 
          accessToken: accessToken || '', // Empty string if missing, will be refreshed
          refreshToken, 
          user 
        };
      }
      
      console.log('[AuthSlice] No auth data in storage');
      return null;
    } catch (err: any) {
      return rejectWithValue('Failed to load auth data');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.status = 'idle';
      state.otpStatus = 'idle';
      state.error = null;
      state.isAuthenticated = false;
      
      // Clear AsyncStorage
      AsyncStorage.multiRemove([
        '@rangbaj_access_token',
        '@rangbaj_refresh_token',
        '@rangbaj_user',
        '@rangbaj_phone_number',
      ]);
    },
    setToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.tokenIssuedAt = Date.now(); // Record when token was issued
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError(state) {
      state.error = null;
    },
    resetOtpStatus(state) {
      state.otpStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin login
      .addCase(fetchAuthToken.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAuthToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchAuthToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to authenticate';
      })
      // Send OTP
      .addCase(sendOtpAsync.pending, (state) => {
        state.otpStatus = 'sending';
        state.error = null;
      })
      .addCase(sendOtpAsync.fulfilled, (state) => {
        state.otpStatus = 'sent';
        state.error = null;
      })
      .addCase(sendOtpAsync.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.error = action.payload || 'Failed to send OTP';
      })
      // Verify OTP
      .addCase(verifyOtpAsync.pending, (state) => {
        state.otpStatus = 'verifying';
        state.error = null;
      })
      .addCase(verifyOtpAsync.fulfilled, (state, action) => {
        state.otpStatus = 'verified';
        state.status = 'succeeded';
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.tokenIssuedAt = Date.now(); // Record when token was issued
        state.error = null;
      })
      .addCase(verifyOtpAsync.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.error = action.payload || 'Invalid or expired OTP';
      })
      // Load from storage
      .addCase(loadAuthFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.status = 'succeeded';
        } else {
          // If no auth data in storage, clear the state (handles force expire case)
          state.accessToken = null;
          state.refreshToken = null;
          state.user = null;
          state.isAuthenticated = false;
          state.tokenIssuedAt = null;
          state.status = 'idle';
        }
      });
  },
});

export const { logout, setToken, setUser, clearError, resetOtpStatus } = authSlice.actions;

// Selectors
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectOtpStatus = (state: RootState) => state.auth.otpStatus;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectTokenIssuedAt = (state: RootState) => state.auth.tokenIssuedAt;

// Legacy selector for backward compatibility
export const selectAuthToken = (state: RootState) => state.auth.accessToken;

export default authSlice.reducer;
