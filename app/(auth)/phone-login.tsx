import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FloatingAlert from '@/components/common/FloatingAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Rect, Defs, Stop, RadialGradient } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Abstract design component
const AbstractBackground = () => {
  const dimensions = useWindowDimensions();
  
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Svg height="100%" width="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        <Defs>
          <RadialGradient id="grad1" cx="50%" cy="30%" rx="65%" ry="65%" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#00BFA5" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#00BFA5" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="grad2" cx="30%" cy="70%" rx="55%" ry="55%" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#00796B" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#00796B" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="#121212" />
        <Circle cx={dimensions.width * 0.7} cy={dimensions.height * 0.3} r={dimensions.width * 0.6} fill="url(#grad1)" />
        <Circle cx={dimensions.width * 0.3} cy={dimensions.height * 0.7} r={dimensions.width * 0.5} fill="url(#grad2)" />
        <Circle cx={dimensions.width * 0.8} cy={dimensions.height * 0.8} r="60" fill="#00BFA5" opacity="0.1" />
        <Circle cx={dimensions.width * 0.2} cy={dimensions.height * 0.2} r="40" fill="#00796B" opacity="0.1" />
      </Svg>
    </View>
  );
};

export default function PhoneLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('error');
  
  // Refs for OTP inputs
  const otpInputs = useRef<Array<TextInput | null>>([]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Run animations when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 800,
      delay: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOtpSent, timer]);
  
  // Format phone number as the user types
  const handlePhoneNumberChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Store the raw numeric value
    setPhoneNumber(numericValue);
    
    // Format for display: +91 xxxxx xxxxx
    if (numericValue.length > 0) {
      let formatted = '+91 ';
      
      if (numericValue.length <= 5) {
        formatted += numericValue;
      } else {
        formatted += `${numericValue.substring(0, 5)} ${numericValue.substring(5, 10)}`;
      }
      
      setFormattedPhoneNumber(formatted);
    } else {
      setFormattedPhoneNumber('');
    }
  };
  
  // Handle OTP input changes and auto-focus the next input
  const handleOtpChange = (text: string, index: number) => {
    // Copy the current OTP array
    const newOtp = [...otp];
    
    // Update the current input value (keeping only the last digit if multiple are pasted)
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    
    // Auto-focus to next input if a digit was entered
    if (text.length === 1 && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };
  
  // Handle OTP input keypress for backspace
  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      // Focus previous input when backspace is pressed on an empty input
      otpInputs.current[index - 1]?.focus();
    }
  };
  
  // Send OTP to phone number
  const handleSendOtp = () => {
    // Reset any existing errors
    setError('');
    
    // Basic validation
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, you would call an API to send OTP
    // Simulating API call with setTimeout
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setTimer(60); // Set a 60-second timer for resend
      
      setAlertType('info');
      setAlertMessage('OTP sent to your phone number');
      setShowAlert(true);
      
      // Focus the first OTP input
      setTimeout(() => {
        otpInputs.current[0]?.focus();
      }, 500);
    }, 1500);
  };
  
  // Resend OTP
  const handleResendOtp = () => {
    if (timer === 0) {
      setTimer(60);
      
      setAlertType('info');
      setAlertMessage('OTP resent to your phone number');
      setShowAlert(true);
      
      // In a real app, you would call the API to resend OTP
    }
  };
  
  // Verify OTP and login
  const handleVerifyOtp = async () => {
    // Reset any existing errors
    setError('');
    
    // Check if all OTP digits are entered
    if (otp.some(digit => digit === '')) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would call an API to verify OTP
      // Simulating API call with setTimeout
      setTimeout(async () => {
        // For demo purposes, we'll just consider 123456 as the correct OTP
        const enteredOtp = otp.join('');
        
        if (enteredOtp === '123456') {
          // Store auth token (in a real app)
          await AsyncStorage.setItem('@rangbaj_auth_token', 'demo_token');
          await AsyncStorage.setItem('@rangbaj_phone_number', phoneNumber);
          
          setAlertType('success');
          setAlertMessage('Login successful!');
          setShowAlert(true);
          
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 1000);
        } else {
          setError('Invalid OTP. Please try again');
          setAlertType('error');
          setAlertMessage('Verification failed. Please check the OTP and try again.');
          setShowAlert(true);
        }
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setError('An error occurred during verification');
      setIsLoading(false);
    }
  };
  
  // Change phone number
  const handleChangePhoneNumber = () => {
    setIsOtpSent(false);
    setOtp(['', '', '', '', '', '']);
    setTimer(0);
  };

  const handleSkipLogin = async () => {
    try {
      await AsyncStorage.setItem('skipLogin', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error skipping login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AbstractBackground />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[styles.content, { paddingTop: insets.top, paddingBottom: Platform.OS === 'ios' ? insets.bottom + 20 : 20 }]}>
          <Animated.View 
            style={[styles.logoContainer, { opacity: fadeAnim }]}
          >
            <Image 
              source={require('@/assets/images/rangbaj-colored-dark.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.formContainer, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {!isOtpSent ? (
              // Phone Number Input Screen
              <>
                <Text style={styles.title}>Welcome to Rangbaj</Text>
                <Text style={styles.subtitle}>Enter your phone number to continue</Text>
                
                {error ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={20} color="#FF4B55" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
                
                <View style={styles.inputContainer}>
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Phone Number"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="number-pad"
                    value={formattedPhoneNumber.replace('+91 ', '')}
                    onChangeText={handlePhoneNumberChange}
                    maxLength={14} // +91 xxxxx xxxxx
                  />
                </View>
                
                <TouchableOpacity
                  style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
                  onPress={handleSendOtp}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#00BFA5', '#00796B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                  {isLoading ? (
                    <Text style={styles.actionButtonText}>Sending OTP...</Text>
                  ) : (
                    <Text style={styles.actionButtonText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkipLogin}
                >
                  <Text style={styles.skipButtonText}>Skip Login</Text>
                </TouchableOpacity>
                
                <View style={styles.infoContainer}>
                  <Ionicons name="information-circle-outline" size={18} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.infoText}>We'll send a one-time password to verify your phone number</Text>
                </View>
              </>
            ) : (
              // OTP Verification Screen
              <>
                <Text style={styles.title}>Verify Your Number</Text>
                <Text style={styles.subtitle}>Enter the 6-digit code sent to {formattedPhoneNumber}</Text>
                
                {error ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={20} color="#FF4B55" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
                
                <View style={styles.otpContainer}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                      key={index}
                      ref={(input) => { otpInputs.current[index] = input; }}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={otp[index]}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    />
                  ))}
                </View>
                
                <TouchableOpacity
                  style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#00BFA5', '#00796B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                  {isLoading ? (
                    <Text style={styles.actionButtonText}>Verifying...</Text>
                  ) : (
                    <Text style={styles.actionButtonText}>Verify & Continue</Text>
                  )}
                </TouchableOpacity>
                
                <View style={styles.otpActionsContainer}>
                  <TouchableOpacity 
                    style={styles.changeNumberButton} 
                    onPress={handleChangePhoneNumber}
                  >
                    <Ionicons name="arrow-back-outline" size={16} color="#00BFA5" />
                    <Text style={styles.changeNumberText}>Change Number</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.resendButton, timer > 0 && styles.resendButtonDisabled]} 
                    onPress={handleResendOtp}
                    disabled={timer > 0}
                  >
                    <Text style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}>
                      {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
          
          <Animated.View
            style={[styles.footerContainer, { opacity: fadeInAnim }]}
          >
            <Text style={styles.footerText}>By continuing, you agree to our</Text>
            <View style={styles.footerLinksContainer}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerText}> & </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
      
      <FloatingAlert
        visible={showAlert}
        type={alertType}
        message={alertMessage}
        duration={3000}
        onClose={() => setShowAlert(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 180,
    height: 60,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.75)',
    backdropFilter: 'blur(10px)',
    padding: 24,
    marginBottom: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
    lineHeight: 22,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 75, 85, 0.1)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF4B55',
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    height: 56,
    marginBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  countryCode: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 16,
    paddingLeft: 8,
  },
  actionButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  infoText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 45,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  otpActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  changeNumberButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeNumberText: {
    color: '#00BFA5',
    fontSize: 14,
    marginLeft: 4,
  },
  resendButton: {
    padding: 4,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#00BFA5',
    fontSize: 14,
  },
  resendTextDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
  skipButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#888',
    fontSize: 16,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  footerLinksContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  footerLink: {
    color: '#00BFA5',
    fontSize: 14,
  },
});
