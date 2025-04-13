import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/context/ThemeContext';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';
import Splash from '@/components/common/Splash';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [splashEnd, setSplashEnd] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Check if user has completed onboarding
        const onboardingStatus = await AsyncStorage.getItem('@rangbaj_onboarding_complete');
        const hasCompletedOnboarding = onboardingStatus === 'true';
        setHasCompletedOnboarding(hasCompletedOnboarding);

        // Check if user is authenticated
        const authToken = await AsyncStorage.getItem('@rangbaj_auth_token');
        const isAuthenticated = !!authToken;
        setIsAuthenticated(isAuthenticated);

        // Determine initial route
        let route;
        if (!hasCompletedOnboarding) {
          route = '(onboarding)';
        } else if (!isAuthenticated) {
          route = '(auth)';
        } else {
          route = '(tabs)';
        }
        
        setInitialRoute(route);
        setIsReady(true);

        // Hide splash screen only after everything is ready
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Error preparing app:', e);
        setInitialRoute('(auth)');
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if(!splashEnd) {
    return <Splash onAnimationEnd={() => {setSplashEnd(true)}}/>;
  }

  // Show nothing until we're ready
  if (!isReady || !initialRoute) {
    return null;
  }



  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <StatusBar style="light" />
            <Stack
              initialRouteName={initialRoute}
              screenOptions={{
                headerShown: false,
                contentStyle: { 
                  backgroundColor: Platform.OS === 'ios' ? '#000' : '#121212' 
                },
                animation: 'fade',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="subscriptions" options={{ headerShown: false }} />
              <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="show/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
            </Stack>
          </ThemeProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
