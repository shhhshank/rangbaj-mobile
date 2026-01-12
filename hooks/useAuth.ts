/**
 * useAuth Hook
 * Custom hook for authentication state and actions
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  loadAuthFromStorage,
  selectIsAuthenticated,
  selectUser,
  selectAccessToken,
  selectAuthStatus,
  logout as logoutAction,
} from '@/redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);
  const authStatus = useSelector(selectAuthStatus);

  // Load auth from storage on mount
  useEffect(() => {
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    isAuthenticated,
    user,
    accessToken,
    authStatus,
    logout,
    isLoading: authStatus === 'loading',
  };
};
