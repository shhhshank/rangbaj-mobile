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
            <Stop offset="0%" stopColor="#7E57C2" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#7E57C2" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="grad2" cx="30%" cy="70%" rx="55%" ry="55%" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#3949AB" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#3949AB" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="#121212" />
        <Circle cx={dimensions.width * 0.7} cy={dimensions.height * 0.3} r={dimensions.width * 0.6} fill="url(#grad1)" />
        <Circle cx={dimensions.width * 0.3} cy={dimensions.height * 0.7} r={dimensions.width * 0.5} fill="url(#grad2)" />
        <Circle cx={dimensions.width * 0.8} cy={dimensions.height * 0.8} r="60" fill="#7E57C2" opacity="0.1" />
        <Circle cx={dimensions.width * 0.2} cy={dimensions.height * 0.2} r="40" fill="#3949AB" opacity="0.1" />
      </Svg>
    </View>
  );
};

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  
  const handleSignup = async () => {
    // Reset any existing errors
    setError('');
    
    // Basic validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would call an API to register the user
      // Simulating API call with setTimeout
      setTimeout(async () => {
        // For demo purposes, we'll just consider it successful
        await AsyncStorage.setItem('@rangbaj_auth_token', 'demo_token');
        
        setAlertType('success');
        setAlertMessage('Account created successfully!');
        setShowAlert(true);
        
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1500);
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Signup Error:', error);
      setError('An error occurred during signup');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to start your entertainment journey</Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF4B55" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>
          
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
          
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color="rgba(255,255,255,0.7)" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color="rgba(255,255,255,0.7)" 
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#7E57C2', '#3949AB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
            {isLoading ? (
              <Text style={styles.signupButtonText}>Creating Account...</Text>
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.socialSignupContainer}>
            <Text style={styles.orText}>or sign up with</Text>
            
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View
          style={[styles.loginContainer, { opacity: fadeInAnim }]}
        >
          <Text style={styles.loginText}>Already have an account?</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
    marginBottom: 16,
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
  eyeIcon: {
    padding: 8,
  },
  signupButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialSignupContainer: {
    alignItems: 'center',
  },
  orText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 16,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginRight: 8,
  },
  loginLink: {
    color: '#7E57C2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
