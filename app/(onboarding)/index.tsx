import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Rect, Defs, Stop, RadialGradient } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Data for onboarding slides
const slides = [
  {
    id: 1,
    title: 'Welcome to Rangbaj',
    description: 'Your premium entertainment platform with thousands of movies, shows, and exclusive content',
    iconName: 'film-outline' as const,
    gradientColors: ['#FF4081', '#9C27B0'] as readonly [string, string],
  },
  {
    id: 2,
    title: 'Stream Anywhere',
    description: 'Watch your favorite content on any device, anytime, with seamless streaming experience',
    iconName: 'tv-outline' as const,
    gradientColors: ['#9C27B0', '#3F51B5'] as readonly [string, string],
  },
  {
    id: 3,
    title: 'Download & Watch Offline',
    description: 'Download your favorite shows and movies to watch them offline whenever you want',
    iconName: 'download-outline' as const,
    gradientColors: ['#3F51B5', '#00BCD4'] as readonly [string, string],
  },
  {
    id: 4,
    title: 'Personalized Experience',
    description: 'Get personalized recommendations based on your viewing preferences and habits',
    iconName: 'person-outline' as const,
    gradientColors: ['#00BCD4', '#4CAF50'] as readonly [string, string],
  },
  {
    id: 5,
    title: 'Ready to Start?',
    description: 'Create an account or sign in to start your premium entertainment journey',
    iconName: 'rocket-outline' as const,
    gradientColors: ['#4CAF50', '#FF4081'] as readonly [string, string],
  },
];

// Abstract background component based on slide index
const AbstractBackground = ({ slideIndex }: { slideIndex: number }) => {
  const dimensions = useWindowDimensions();
  const slide = slides[slideIndex];
  const [color1, color2] = slide.gradientColors;
  
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Svg height="100%" width="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        <Defs>
          <RadialGradient id="grad1" cx="50%" cy="30%" rx="65%" ry="65%" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor={color1} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={color1} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="grad2" cx="30%" cy="70%" rx="55%" ry="55%" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor={color2} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={color2} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="#121212" />
        <Circle cx={dimensions.width * 0.7} cy={dimensions.height * 0.3} r={dimensions.width * 0.6} fill="url(#grad1)" />
        <Circle cx={dimensions.width * 0.3} cy={dimensions.height * 0.7} r={dimensions.width * 0.5} fill="url(#grad2)" />
        <Circle cx={dimensions.width * 0.8} cy={dimensions.height * 0.8} r="60" fill={color1} opacity="0.1" />
        <Circle cx={dimensions.width * 0.2} cy={dimensions.height * 0.2} r="40" fill={color2} opacity="0.1" />
      </Svg>
    </View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  
  const [slideIndex, setSlideIndex] = useState(0);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;
  
  // Function to mark onboarding as completed and navigate to login
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@rangbaj_onboarding_complete', 'true');
      router.replace('/(auth)/phone-login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };
  
  // Handle next slide or complete onboarding
  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      // Create a sequence of animations for smooth transition
      Animated.sequence([
        // First fade out
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        // Then reset the slide position while it's invisible
        Animated.timing(slideAnimation, {
          toValue: dimensions.width * 0.2,
          duration: 0,
          useNativeDriver: true
        })
      ]).start(() => {
        // After animation completes, change the slide index
        setSlideIndex(slideIndex + 1);
        
        // Then animate in the new slide
        Animated.parallel([
          // Slide in from right
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true
          }),
          // Fade in
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true
          })
        ]).start();
      });
    } else {
      completeOnboarding();
    }
  };
  
  // Skip onboarding and go to login
  const handleSkip = () => {
    completeOnboarding();
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <AbstractBackground slideIndex={slideIndex} />
      
      <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/rangbaj-colored-dark.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          {slideIndex < slides.length - 1 && (
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.slidesContainer}>
          <Animated.View 
            style={[
              styles.slideContent,
              {
                opacity: opacityAnimation,
                transform: [{ translateX: slideAnimation }],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={slides[slideIndex].gradientColors}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons 
                  name={slides[slideIndex].iconName} 
                  size={32} 
                  color="#fff" 
                />
              </LinearGradient>
            </View>
            
            <Text style={styles.slideTitle}>{slides[slideIndex].title}</Text>
            <Text style={styles.slideDescription}>{slides[slideIndex].description}</Text>
          </Animated.View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === slideIndex && styles.paginationDotActive,
                  {
                    backgroundColor: index === slideIndex 
                      ? slides[slideIndex].gradientColors[0]
                      : 'rgba(255,255,255,0.3)',
                  },
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={slides[slideIndex].gradientColors}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            <Text style={styles.nextButtonText}>
              {slideIndex < slides.length - 1 ? 'Next' : 'Get Started'}
            </Text>
            <Ionicons 
              name={slideIndex < slides.length - 1 ? 'arrow-forward' as const : 'rocket-outline' as const} 
              size={20} 
              color="#fff" 
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  logo: {
    width: 150,
    height: 50,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  slidesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 32,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  paginationDotActive: {
    width: 30,
  },
  nextButton: {
    flexDirection: 'row',
    height: 56,
    paddingHorizontal: 40,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
