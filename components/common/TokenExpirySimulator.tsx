/**
 * Token Expiry Simulator
 * Simulates token expiry for testing refresh flow
 * Only active in development mode
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectIsAuthenticated, selectAccessToken, selectTokenIssuedAt, setToken } from '@/redux/slices/authSlice';
import { DEBUG_CONFIG, getTokenExpiryMessage } from '@/constants/DebugConfig';
import { AppDispatch } from '@/redux/store';

const TokenExpirySimulator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accessToken = useSelector(selectAccessToken);
  const tokenIssuedAt = useSelector(selectTokenIssuedAt);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);

  useEffect(() => {
    if (!DEBUG_CONFIG.FAST_TOKEN_EXPIRY || !isAuthenticated || !accessToken || !tokenIssuedAt) {
      setTimeUntilExpiry(null);
      return;
    }

    console.log('[TokenExpirySimulator] Token issued at:', new Date(tokenIssuedAt).toLocaleTimeString());

    // Update countdown every second
    const interval = setInterval(() => {
      const elapsed = Date.now() - tokenIssuedAt;
      const remaining = Math.max(0, DEBUG_CONFIG.TOKEN_EXPIRY_TIME - elapsed);
      setTimeUntilExpiry(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, accessToken, tokenIssuedAt]);

  const handleForceExpire = async () => {
    if (!isAuthenticated) return;

    console.log('[TokenExpirySimulator] Forcing token expiry...');
    
    // Clear the access token to simulate expiry
    await AsyncStorage.removeItem('@rangbaj_access_token');
    
    console.log('[TokenExpirySimulator] Access token removed. Next API call will trigger refresh.');
    alert('Token expired! Make an API call to test refresh flow.');
  };

  if (!DEBUG_CONFIG.FAST_TOKEN_EXPIRY || !isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⏱️ Token Expiry Simulator</Text>
        <Text style={styles.subtitle}>DEBUG MODE ACTIVE</Text>
      </View>

      {timeUntilExpiry !== null && timeUntilExpiry > 0 && (
        <View style={styles.countdown}>
          <Text style={styles.countdownText}>
            Token expires in: <Text style={styles.countdownNumber}>{timeUntilExpiry}s</Text>
          </Text>
        </View>
      )}

      {timeUntilExpiry === 0 && (
        <View style={styles.expired}>
          <Text style={styles.expiredText}>⚠️ Token Expired!</Text>
          <Text style={styles.expiredSubtext}>Make an API call to test refresh</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleForceExpire}
      >
        <Text style={styles.buttonText}>🔥 Force Expire Now</Text>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 In debug mode, tokens expire after 15 seconds instead of 15 minutes.
          {'\n'}
          This helps test the automatic refresh flow quickly.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 152, 0, 0.95)',
    borderRadius: 12,
    padding: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 9998,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    marginTop: 2,
  },
  countdown: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  countdownText: {
    color: '#fff',
    fontSize: 14,
  },
  countdownNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expired: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  expiredText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expiredSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  info: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    lineHeight: 16,
  },
});

export default TokenExpirySimulator;
