import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, LogBox, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/context/ThemeContext';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';
import Splash from '@/components/common/Splash';
import { refreshAdminToken } from '@/redux/authUtils';
import { setupAxiosInterceptors } from '@/utils/axiosInterceptor';

// Suppress specific warnings
LogBox.ignoreLogs([
  'Encountered two children with the same key',
  'Non-unique keys may cause children to be duplicated',
  'VirtualizedLists should never be nested',
  'Setting a timer',
  "Text strings must be rendered within a <Text> component.",
  "Call Stack"
]);

// Suppress console errors for duplicate keys
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Encountered two children with the same key') ||
     args[0].includes('Non-unique keys may cause children') ||
     args[0].includes('Text strings must be rendered within a <Text> component.') ||
     args[0].includes('Call Stack'))
  ) {
    return; // Suppress this error
  }
  originalError(...args);
};

// Optionally disable all logs (comment out if you want to see other logs)
// LogBox.ignoreAllLogs(true);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [splashEnd, setSplashEnd] = useState(false);

  useEffect(() => {
    // Setup axios interceptors for auth
    setupAxiosInterceptors();
    
    // Hide the native splash screen immediately since we have custom splash
    SplashScreen.hideAsync();
    
    // Refresh admin token on app start (for admin users)
    refreshAdminToken();
  }, []);

  // Render everything inside Provider to ensure Redux is available
  // Splash is shown as an overlay until animation ends
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <StatusBar style="light" />
            {!splashEnd ? (
              // Show splash screen with proper container
              <Splash onAnimationEnd={() => {setSplashEnd(true)}}/>
            ) : (
              // After splash ends, render the navigation stack
              // The app/index.tsx will handle the redirect to the correct route
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { 
                    backgroundColor: Platform.OS === 'ios' ? '#000' : '#121212' 
                  },
                  animation: 'fade',
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
                <Stack.Screen name="settings" options={{ headerShown: false }} />
                <Stack.Screen name="subscriptions" options={{ headerShown: false }} />
                <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="show/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
              </Stack>
            )}
          </ThemeProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
