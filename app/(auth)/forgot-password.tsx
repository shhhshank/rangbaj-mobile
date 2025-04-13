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
import Svg, { Circle, Path, Rect, Defs, Stop, RadialGradient } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Abstract design component
const AbstractBackground = () => {
  const dimensions = useWindowDimensions();
  
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Svg height="100%" width="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        <Defs>
          <RadialGradient id="grad1" cx="50%" cy="30%" rx="65%" ry="65%" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#00B4DB" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#00B4DB" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="grad2" cx="30%" cy="70%" rx="55%" ry="55%" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#0083B0" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#0083B0" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="#121212" />
        <Circle cx={dimensions.width * 0.7} cy={dimensions.height * 0.3} r={dimensions.width * 0.6} fill="url(#grad1)" />
        <Circle cx={dimensions.width * 0.3} cy={dimensions.height * 0.7} r={dimensions.width * 0.5} fill="url(#grad2)" />
        <Circle cx={dimensions.width * 0.8} cy={dimensions.height * 0.8} r="60" fill="#00B4DB" opacity="0.1" />
        <Circle cx={dimensions.width * 0.2} cy={dimensions.height * 0.2} r="40" fill="#0083B0" opacity="0.1" />
      </Svg>
    </View>
  );
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('error');
  
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
  
  const handlePasswordReset = async () => {
    // Reset any existing errors
    setError('');
    
    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would call an API to reset the password
      // Simulating API call with setTimeout
      setTimeout(() => {
        // For demo purposes, we'll just consider it successful
        setAlertType('success');
        setAlertMessage('Password reset instructions sent to your email!');
        setShowAlert(true);
        
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Password Reset Error:', error);
      setError('An error occurred during password reset');
      setIsLoading(false);
    }
  };
  
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <AbstractBackground />
      
      <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      
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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you instructions to reset your password
          </Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF4B55" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
            onPress={handlePasswordReset}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#00B4DB', '#0083B0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
            {isLoading ? (
              <Text style={styles.resetButtonText}>Sending...</Text>
            ) : (
              <Text style={styles.resetButtonText}>Send Reset Instructions</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View
          style={[styles.loginContainer, { opacity: fadeInAnim }]}
        >
          <Text style={styles.loginText}>Remember your password?</Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      <FloatingAlert
        visible={showAlert}
        type={alertType}
        message={alertMessage}
        duration={3000}
        onClose={() => setShowAlert(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 10,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 16,
  },
  resetButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginRight: 8,
  },
  loginLink: {
    color: '#00B4DB',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
