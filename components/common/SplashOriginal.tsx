import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Svg, Path, LinearGradient, Stop, Defs, G, Rect } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedProps,
  withTiming, 
  withSequence,
  withDelay,
  Easing, 
  runOnJS
} from 'react-native-reanimated';

// Create animated components for SVG elements
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

type SplashProps = {
  onAnimationEnd: () => void;
};

const Splash = ({onAnimationEnd}: SplashProps) => {
  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const pathDrawProgress = useSharedValue(1);
  const pathFillOpacity = useSharedValue(0);
  const backgroundAnim = useSharedValue(0);
  
  const { width } = Dimensions.get('window');
  const logoSize = Math.min(width * 0.7, 300); // Cap at 300 or 70% of screen width

  useEffect(() => {
    // Initial fade in animation
    opacity.value = withTiming(1, { duration: 600 });
    
    // Modern subtle scale animation
    scale.value = withSequence(
      withTiming(1, { 
        duration: 800, 
        easing: Easing.out(Easing.cubic) 
      }),
      withDelay(2400, withTiming(1.03, { 
        duration: 300,
        easing: Easing.inOut(Easing.cubic)
      })),
      withTiming(1, { 
        duration: 300,
        easing: Easing.inOut(Easing.cubic)
      })
    );
    
    // Background animation
    backgroundAnim.value = withSequence(
      withTiming(0.3, { duration: 400 }),
      withTiming(0.1, { duration: 2000 }),
      withTiming(0, { duration: 400 })
    );
    
    // Path drawing animation - tracing effect (slower, more visible)
    pathDrawProgress.value = withTiming(0, { 
      duration: 2000, // Increased from 1200 to 2000 for slower, more visible drawing
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    });
    
    // Fill color animation - starts after path is drawn with longer delay
    pathFillOpacity.value = withDelay(1800, withTiming(1, { 
      duration: 800,
      easing: Easing.inOut(Easing.cubic)
    }));
    
    // Exit animation after 4.5 seconds (longer to enjoy the animation)
    const timeout = setTimeout(() => {
      // Fast exit with reverse animation
      
      // Step 1: Quick fade out of fill
      pathFillOpacity.value = withTiming(0, { 
        duration: 300,
        easing: Easing.out(Easing.cubic)
      });
      
      // Step 2: Quickly reverse the path drawing
      pathDrawProgress.value = withDelay(150, withTiming(1, { 
        duration: 600, // Fast reverse drawing
        easing: Easing.inOut(Easing.cubic)
      }));
      
      // Step 3: Scale and fade out at the same time
      scale.value = withDelay(400, withTiming(0.9, { 
        duration: 300,
        easing: Easing.out(Easing.cubic)
      }));
      
      // Final fade out
      opacity.value = withDelay(700, withTiming(0, { 
        duration: 200, 
        easing: Easing.out(Easing.cubic)
      }, () => {
        runOnJS(onAnimationEnd)();
      }));
      
    }, 4500);
    
    return () => clearTimeout(timeout);
  }, []);

  // Container animation
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));
  
  // Background animation
  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundAnim.value,
  }));
  
  // Animate the path drawing using strokeDashoffset
  const pathProps = useAnimatedProps(() => ({
    strokeDashoffset: pathDrawProgress.value * 2000
  }));
  
  // Animate the fill opacity
  const fillProps = useAnimatedProps(() => ({
    fillOpacity: pathFillOpacity.value
  }));

  // Use modified paths with slightly extended coordinates to ensure the top arc is visible
  // Original paths from SVG
  const topPath = "M667.13,770.91h-99.01c-0.03-21.98-3.6-39.21-9.34-54.25c-5.78-14.98-13.93-28.05-24.45-40.66c-7.03-8.38-15.11-16.5-24.09-24.52c-3.27-2.94-6.73-5.84-10.23-8.78c9.24-7.62,19.17-15.21,29.54-22.9c14.29-10.63,29.34-21.42,44.35-33.27c2.11-1.68,4.26-3.43,6.4-5.15c0.56,0.5,1.12,1.02,1.68,1.55c17.46,16.17,34.42,34.88,48.64,57.36c9.47,14.98,17.66,31.62,23.79,49.83C662.64,714.41,667.17,741.5,667.13,770.91z";
  const leftPath = "M500.02,518.46c-9.29,6.99-19.23,14.2-29.5,21.84c-15.13,11.26-31.05,23.35-46.65,37.28c-1.38,1.26-2.78,2.55-4.13,3.82c-16.56-13.47-32.95-28.43-47.38-46.68c-9.74-12.35-18.55-26.22-25.32-41.88c-9.04-20.77-14.23-44.57-14.18-69.84V229.09h99v193.91c0.03,10.47,1.66,18.67,4.35,26.27c2.78,7.63,6.79,14.85,12.55,22.43c3.82,5.05,8.42,10.19,13.75,15.44c7.1,7.02,15.55,14.26,24.98,21.7C491.49,511.97,495.73,515.2,500.02,518.46z";
  const mainPath = "M667.12,422.99c0.06,21.33-3.59,41.6-10.22,59.9c-6.6,18.33-16.08,34.55-26.83,48.73c-7.19,9.43-14.96,18.02-22.99,25.96c-8.7,8.59-17.71,16.39-26.78,23.8c-2.13,1.71-4.29,3.45-6.4,5.14c-15.02,11.85-30.06,22.65-44.35,33.26c-10.36,7.69-20.29,15.3-29.53,22.9c-5.14,4.27-10.05,8.51-14.65,12.8c-13.05,12.1-23.92,24.42-32.31,37.73c-5.61,8.87-10.19,18.19-13.67,28.55c-4.66,13.84-7.49,29.61-7.52,49.15h-99c-0.06-33.12,5.7-63.24,15.97-89.77c10.19-26.61,24.7-49.37,40.95-68.71c9.54-11.4,19.65-21.61,29.95-31.05c1.35-1.26,2.75-2.55,4.13-3.82c15.61-13.92,31.52-26.02,46.65-37.28c10.27-7.64,20.21-14.85,29.5-21.84c6.04-4.52,11.76-8.95,17.15-13.31c13.67-11.06,24.81-21.64,32.76-31.77c5.33-6.76,9.29-13.25,12.18-19.87c3.79-8.93,5.98-18.13,6.01-30.51c0-7.52-1.54-14.6-4.77-22.26c-3.2-7.63-8.22-15.61-14.6-23.44c-12.72-15.61-28.77-27.85-46.96-36.27c-18.19-8.45-38.46-12.94-59.17-12.94H332.87v-99h109.75c35.06,0,69.44,7.58,100.74,22.09c31.33,14.48,59.65,35.96,82.16,63.61c11.06,13.59,21.3,29.25,29,47.33C662.18,380.16,667.18,400.87,667.12,422.99z";

  return (
    <View style={styles.container}>
      {/* Background color effect */}
      <Animated.View style={[styles.backgroundEffect, backgroundStyle]} />
      
      <Animated.View style={[containerStyle, styles.logoContainer]}>
        <Svg width={logoSize} height={logoSize} viewBox="0 0 500 500">
          <Defs>
            {/* Top-right section gradient (teal to purple) */}
            <LinearGradient id="grad1" x1="583.572" y1="769.6279" x2="583.572" y2="234.9181" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#40E4CC" />
              <Stop offset="1" stopColor="#6C4BEF" />
            </LinearGradient>
            
            {/* Left section gradient (teal to purple) */}
            <LinearGradient id="grad2" x1="416.4455" y1="769.6431" x2="416.4455" y2="234.9175" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#40E4CC" />
              <Stop offset="1" stopColor="#6C4BEF" />
            </LinearGradient>
            
            {/* Main diagonal gradient (orange to pink to purple) */}
            <LinearGradient id="grad3" x1="499.9953" y1="769.6356" x2="499.9953" y2="235.7453" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#F69936" />
              <Stop offset="0.5" stopColor="#FE3ED2" />
              <Stop offset="1" stopColor="#6C4BEF" />
            </LinearGradient>
          </Defs>
          
          {/* Draw the full R before animation to capture all parts, including the top-right arc */}
          <AnimatedG transform="matrix(0.6867859959602356, 0, 0, 0.6867859959602356, -93.3895187377932, -93.38614654541016)">
            {/* First draw the complete paths with very low opacity */}
            <Path
              d={topPath}
              stroke="url(#grad1)"
              strokeWidth={1}
              fill="transparent"
              opacity={0.01} // Nearly invisible guide to ensure path is renderable
            />
            <Path
              d={leftPath}
              stroke="url(#grad2)"
              strokeWidth={1}
              fill="transparent"
              opacity={0.01} // Nearly invisible guide to ensure path is renderable
            />
            <Path
              d={mainPath}
              stroke="url(#grad3)"
              strokeWidth={1}
              fill="transparent"
              opacity={0.01} // Nearly invisible guide to ensure path is renderable
            />
            
            {/* Stroke animations for each path */}
            <AnimatedPath
              d={topPath}
              stroke="url(#grad1)"
              strokeWidth={3}
              fill="transparent"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={2000}
              animatedProps={pathProps}
            />
            
            <AnimatedPath
              d={leftPath}
              stroke="url(#grad2)"
              strokeWidth={3}
              fill="transparent"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={2000}
              animatedProps={pathProps}
            />
            
            <AnimatedPath
              d={mainPath}
              stroke="url(#grad3)"
              strokeWidth={3}
              fill="transparent"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={2000}
              animatedProps={pathProps}
            />
            
            {/* Fill animations for each path */}
            <AnimatedPath
              d={topPath}
              fill="url(#grad1)"
              animatedProps={fillProps}
            />
            
            <AnimatedPath
              d={leftPath}
              fill="url(#grad2)"
              animatedProps={fillProps}
            />
            
            <AnimatedPath
              d={mainPath}
              fill="url(#grad3)"
              animatedProps={fillProps}
            />
          </AnimatedG>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  backgroundEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(108, 75, 239, 0.15)',
    zIndex: 1
  }
});

export default Splash;
