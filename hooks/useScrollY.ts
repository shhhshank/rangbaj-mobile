import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

/**
 * A hook that provides a shared scroll position Animated.Value 
 * that can be used across components for scroll-based animations
 */
export function useScrollY() {
  // Use a ref to ensure we return the same instance on each render
  const scrollY = useRef(new Animated.Value(0)).current;
  
  return scrollY;
}
