/**
 * Auth Debug Panel
 * A development-only component to verify authentication state
 * Remove or disable in production
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  selectIsAuthenticated,
  selectUser,
  selectAccessToken,
  selectRefreshToken,
  selectAuthStatus,
  selectOtpStatus,
  logout,
} from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';

const AuthDebugPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);
  const authStatus = useSelector(selectAuthStatus);
  const otpStatus = useSelector(selectOtpStatus);
  
  // AsyncStorage state
  const [storageTokens, setStorageTokens] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    user: string | null;
    phone: string | null;
  }>({
    accessToken: null,
    refreshToken: null,
    user: null,
    phone: null,
  });
  
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    const accessToken = await AsyncStorage.getItem('@rangbaj_access_token');
    const refreshToken = await AsyncStorage.getItem('@rangbaj_refresh_token');
    const user = await AsyncStorage.getItem('@rangbaj_user');
    const phone = await AsyncStorage.getItem('@rangbaj_phone_number');
    
    setStorageTokens({ accessToken, refreshToken, user, phone });
  };

  const handleRefresh = () => {
    loadStorageData();
  };

  const handleClearStorage = async () => {
    await AsyncStorage.multiRemove([
      '@rangbaj_access_token',
      '@rangbaj_refresh_token',
      '@rangbaj_user',
      '@rangbaj_phone_number',
    ]);
    loadStorageData();
  };

  const handleLogout = () => {
    dispatch(logout());
    setTimeout(loadStorageData, 500);
  };

  const truncate = (str: string | null, length: number = 20) => {
    if (!str) return 'null';
    return str.length > length ? `${str.substring(0, length)}...` : str;
  };

  if (!expanded) {
    return (
      <TouchableOpacity
        style={styles.collapsedButton}
        onPress={() => setExpanded(true)}
      >
        <Text style={styles.collapsedText}>🔐 Auth Debug</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔐 Auth Debug Panel</Text>
        <TouchableOpacity onPress={() => setExpanded(false)}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Redux State */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Redux State</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Is Authenticated:</Text>
            <Text style={[styles.value, isAuthenticated ? styles.success : styles.error]}>
              {isAuthenticated ? '✅ Yes' : '❌ No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Auth Status:</Text>
            <Text style={styles.value}>{authStatus}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>OTP Status:</Text>
            <Text style={styles.value}>{otpStatus}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>User ID:</Text>
            <Text style={styles.value}>{user?._id || 'null'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user?.phone || 'null'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Access Token:</Text>
            <Text style={styles.value}>{truncate(accessToken, 30)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Refresh Token:</Text>
            <Text style={styles.value}>{truncate(refreshToken, 30)}</Text>
          </View>
        </View>

        {/* AsyncStorage State */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AsyncStorage</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Access Token:</Text>
            <Text style={[
              styles.value,
              storageTokens.accessToken ? styles.success : styles.error
            ]}>
              {storageTokens.accessToken ? '✅ Present' : '❌ Missing'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Refresh Token:</Text>
            <Text style={[
              styles.value,
              storageTokens.refreshToken ? styles.success : styles.error
            ]}>
              {storageTokens.refreshToken ? '✅ Present' : '❌ Missing'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>User Data:</Text>
            <Text style={[
              styles.value,
              storageTokens.user ? styles.success : styles.error
            ]}>
              {storageTokens.user ? '✅ Present' : '❌ Missing'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{storageTokens.phone || 'null'}</Text>
          </View>
        </View>

        {/* Sync Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sync Status</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Redux ↔ Storage:</Text>
            <Text style={[
              styles.value,
              (accessToken === storageTokens.accessToken) ? styles.success : styles.warning
            ]}>
              {(accessToken === storageTokens.accessToken) ? '✅ Synced' : '⚠️ Out of Sync'}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleRefresh}
          >
            <Text style={styles.buttonText}>🔄 Refresh Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.warningButton]}
            onPress={handleClearStorage}
          >
            <Text style={styles.buttonText}>🗑️ Clear AsyncStorage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>🚪 Logout (Full)</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tests</Text>
          <Text style={styles.instruction}>
            1. Login → Check if tokens appear{'\n'}
            2. Restart app → Check if still authenticated{'\n'}
            3. Wait 15 min → Make API call → Check token refresh{'\n'}
            4. Logout → Check if tokens cleared
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  collapsedButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00BFA5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 9999,
  },
  collapsedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 18, 18, 0.98)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 9999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: {
    color: '#00BFA5',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    flex: 1,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  success: {
    color: '#4CAF50',
  },
  error: {
    color: '#FF4B55',
  },
  warning: {
    color: '#FFA726',
  },
  button: {
    backgroundColor: '#00BFA5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  warningButton: {
    backgroundColor: '#FFA726',
  },
  dangerButton: {
    backgroundColor: '#FF4B55',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instruction: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default AuthDebugPanel;
