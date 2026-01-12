import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '@/redux/store';
import { loadAuthFromStorage } from '@/redux/slices/authSlice';

/**
 * Root index - Entry point for the app
 * This handles the initial redirect based on onboarding and auth state.
 * 
 * Expo Router uses file-based routing and picks routes alphabetically.
 * The initialRouteName prop on Stack doesn't control the initial route in production.
 * This index.tsx file ensures the correct initial route is shown.
 */
export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    async function determineRoute() {
      try {
        console.log('[Index] Determining initial route...');

        // Check if user has completed onboarding
        const onboardingStatus = await AsyncStorage.getItem('@rangbaj_onboarding_complete');
        const hasCompletedOnboarding = onboardingStatus === 'true';
        console.log('[Index] Onboarding completed:', hasCompletedOnboarding);

        if (!hasCompletedOnboarding) {
          console.log('[Index] Redirecting to onboarding');
          setRedirectTo('/(onboarding)');
          setIsLoading(false);
          return;
        }

        // Check auth state from AsyncStorage
        const accessToken = await AsyncStorage.getItem('@rangbaj_access_token');
        const refreshToken = await AsyncStorage.getItem('@rangbaj_refresh_token');
        const authToken = await AsyncStorage.getItem('@rangbaj_auth_token'); // Legacy

        // Also check Redux state
        let reduxAuthState = store.getState().auth;
        
        // If Redux state is empty but AsyncStorage has data, load it
        if (!reduxAuthState.isAuthenticated && (refreshToken || authToken)) {
          console.log('[Index] Loading auth from storage into Redux...');
          await store.dispatch(loadAuthFromStorage());
          reduxAuthState = store.getState().auth;
        }

        const isAuthenticated = !!(authToken || accessToken || reduxAuthState.isAuthenticated);
        console.log('[Index] Is authenticated:', isAuthenticated);

        if (!isAuthenticated) {
          console.log('[Index] Redirecting to auth');
          setRedirectTo('/(auth)');
        } else {
          console.log('[Index] Redirecting to tabs');
          setRedirectTo('/(tabs)');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('[Index] Error determining route:', error);
        setRedirectTo('/(auth)');
        setIsLoading(false);
      }
    }

    determineRoute();
  }, []);

  // Show nothing while loading (the splash screen should still be visible)
  if (isLoading || !redirectTo) {
    return <View style={{ flex: 1, backgroundColor: '#121212' }} />;
  }

  return <Redirect href={redirectTo as any} />;
}
