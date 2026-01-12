/**
 * Network Test Utility
 * Use this to test network connectivity in the APK
 */

import axios from 'axios';
import { API_BASE_URL } from '@/constants/Api';

export interface NetworkTestResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Test basic network connectivity
 */
export const testNetworkConnectivity = async (): Promise<NetworkTestResult> => {
  try {
    console.log('[NetworkTest] Testing connectivity to:', API_BASE_URL);
    
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return {
      success: true,
      message: 'Network connection successful',
      details: response.data,
    };
  } catch (error: any) {
    console.error('[NetworkTest] Connection failed:', error);
    
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        // Network error - no response received
        return {
          success: false,
          message: `Cannot reach server: ${error.message}`,
          details: {
            code: error.code,
            message: error.message,
            url: API_BASE_URL,
          },
        };
      }
      
      // Server responded with error
      return {
        success: false,
        message: `Server error: ${error.response.status}`,
        details: {
          status: error.response.status,
          data: error.response.data,
        },
      };
    }
    
    return {
      success: false,
      message: 'Unknown network error',
      details: error,
    };
  }
};

/**
 * Test OTP endpoint specifically
 */
export const testOtpEndpoint = async (): Promise<NetworkTestResult> => {
  try {
    console.log('[NetworkTest] Testing OTP endpoint');
    
    // Try a simple request to see if endpoint is reachable
    const response = await axios.post(
      `${API_BASE_URL}/auth/send-otp`,
      {
        phone: '+919999999999', // Test number
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: () => true, // Accept any status code
      }
    );
    
    console.log('[NetworkTest] OTP endpoint response:', response.status);
    
    return {
      success: true,
      message: `OTP endpoint reachable (Status: ${response.status})`,
      details: {
        status: response.status,
        data: response.data,
      },
    };
  } catch (error: any) {
    console.error('[NetworkTest] OTP endpoint test failed:', error);
    
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: `Cannot reach OTP endpoint: ${error.message}`,
        details: {
          code: error.code,
          message: error.message,
        },
      };
    }
    
    return {
      success: false,
      message: 'Unknown error testing OTP endpoint',
      details: error,
    };
  }
};

/**
 * Run all network tests
 */
export const runAllNetworkTests = async (): Promise<{
  connectivity: NetworkTestResult;
  otpEndpoint: NetworkTestResult;
}> => {
  console.log('[NetworkTest] Running all network tests...');
  
  const connectivity = await testNetworkConnectivity();
  const otpEndpoint = await testOtpEndpoint();
  
  console.log('[NetworkTest] Results:', { connectivity, otpEndpoint });
  
  return {
    connectivity,
    otpEndpoint,
  };
};
