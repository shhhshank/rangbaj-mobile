import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS } from 'react-native-reanimated';

type SplashProps = {
    onAnimationEnd: () => void;
  };

const Splash = ({onAnimationEnd}:SplashProps) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(9000, withTiming(0, { duration: 1000 }, () => {
        runOnJS(onAnimationEnd)();
    }));
  }, [opacity, onAnimationEnd]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value, 
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle]}>
        <Image
          source={require('@/assets/gifs/rangbaj-splash-dark.gif')}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    top:0,
    bottom:0,
    left:0,
    right:0,
    zIndex:999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  }
});

export default Splash;
