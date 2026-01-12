/**
 * Network Debug Screen
 * Use this to test network connectivity in the APK
 * Access via: /debug-network
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { runAllNetworkTests, NetworkTestResult } from '@/utils/networkTest';
import { API_BASE_URL } from '@/constants/Api';

export default function NetworkDebugScreen() {
  const router = useRouter();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    connectivity?: NetworkTestResult;
    otpEndpoint?: NetworkTestResult;
  } | null>(null);

  const runTests = async () => {
    setTesting(true);
    setResults(null);
    
    try {
      const testResults = await runAllNetworkTests();
      setResults(testResults);
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setTesting(false);
    }
  };

  const renderResult = (title: string, result?: NetworkTestResult) => {
    if (!result) return null;

    return (
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Ionicons
            name={result.success ? 'checkmark-circle' : 'close-circle'}
            size={24}
            color={result.success ? '#10B981' : '#EF4444'}
          />
          <Text style={styles.resultTitle}>{title}</Text>
        </View>
        <Text style={[styles.resultMessage, result.success ? styles.successText : styles.errorText]}>
          {result.message}
        </Text>
        {result.details && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Details:</Text>
            <Text style={styles.detailsText}>
              {JSON.stringify(result.details, null, 2)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Network Debug</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>API Configuration</Text>
          <Text style={styles.infoText}>Base URL: {API_BASE_URL}</Text>
          <Text style={styles.infoText}>Protocol: {API_BASE_URL.startsWith('https') ? 'HTTPS ✓' : 'HTTP ⚠️'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.testButton, testing && styles.testButtonDisabled]}
          onPress={runTests}
          disabled={testing}
        >
          {testing ? (
            <>
              <ActivityIndicator color="#fff" style={styles.loader} />
              <Text style={styles.testButtonText}>Testing...</Text>
            </>
          ) : (
            <>
              <Ionicons name="play-circle" size={24} color="#fff" />
              <Text style={styles.testButtonText}>Run Network Tests</Text>
            </>
          )}
        </TouchableOpacity>

        {results && (
          <View style={styles.resultsContainer}>
            {renderResult('Basic Connectivity', results.connectivity)}
            {renderResult('OTP Endpoint', results.otpEndpoint)}
          </View>
        )}

        <View style={styles.troubleshootingCard}>
          <Text style={styles.troubleshootingTitle}>Common Issues:</Text>
          <Text style={styles.troubleshootingText}>
            • Network error: Check internet connection{'\n'}
            • Timeout: Server may be down or unreachable{'\n'}
            • CORS error: Backend configuration issue{'\n'}
            • 404: Endpoint not found{'\n'}
            • 500: Server error
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BFA5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  loader: {
    marginRight: 8,
  },
  resultsContainer: {
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  resultMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  successText: {
    color: '#10B981',
  },
  errorText: {
    color: '#EF4444',
  },
  detailsContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'monospace',
  },
  troubleshootingCard: {
    backgroundColor: 'rgba(251,191,36,0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
  },
  troubleshootingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FBB024',
    marginBottom: 8,
  },
  troubleshootingText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
});
