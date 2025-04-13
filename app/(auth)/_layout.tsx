import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ headerShown: false }}
      initialRouteName="phone-login"
    >
      <Stack.Screen name="phone-login" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
