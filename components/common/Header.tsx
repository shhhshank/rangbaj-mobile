import { View, StyleSheet, Image, Text, TouchableOpacity, Animated, Pressable } from 'react-native';
import { useRef, useEffect } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useThemeImage } from '@/hooks/useThemeImage';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { Styles } from '@/constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const HEADER_HEIGHT = 50 + Constants.statusBarHeight;

interface HeaderProps {
  scrollY?: Animated.Value;
}

export default function Header({ scrollY }: HeaderProps = {}) {
    const logo = useThemeImage('rangbajColored');
    const router = useRouter();
    
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const searchScaleAnim = useRef(new Animated.Value(0.8)).current;
    
    const primary = useThemeColor("primary");
    const text = useThemeColor("text");
    const background = useThemeColor("background");
    const textSecondary = useThemeColor("textSecondary");
    const solidBackground = useThemeColor("solidBackground");
    
    // Calculate background opacity based on scroll position
    const backgroundOpacity = scrollY
      ? scrollY.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : new Animated.Value(0);
    
    // Entrance animations
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(searchScaleAnim, {
                toValue: 1,
                duration: 500,
                delay: 150,
                useNativeDriver: true,
            })
        ]).start();
    }, []);
    
    const handleSearchPress = () => {
        router.push('/(tabs)/search');
    };
    
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            
            {/* Background that becomes opaque when scrolling */}
            <Animated.View 
                style={[
                    styles.headerBackground,
                    {
                        backgroundColor: background || '#000',
                        opacity: backgroundOpacity,
                    }
                ]}
            />
            
            {/* Semi-transparent gradient when not scrolled */}
            {!scrollY && (
                <LinearGradient
                    colors={[background || '#000', 'rgba(0,0,0,0)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.headerGradient}
                />
            )}
            
            <Animated.View 
                style={[
                    styles.logoContainer,
                    { 
                        opacity: fadeAnim,
                        transform: [{ translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-10, 0]
                        })}]
                    }
                ]}
            >
                <Image source={logo} style={styles.logo} />
            </Animated.View>
            
            <View style={styles.rightContainer}>
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ scale: searchScaleAnim }]
                    }}
                >
                    <TouchableOpacity 
                        style={styles.iconButton}
                        onPress={handleSearchPress}
                        activeOpacity={0.7}
                    >
                        <Feather name="search" size={22} color={text} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: Constants.statusBarHeight + 5,
    height: HEADER_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  logo: {
    height: 32,
    width: 120,
    resizeMode: 'contain',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
});
