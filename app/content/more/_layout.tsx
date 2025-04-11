import { Stack } from 'expo-router';

export default function MoreContentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[section]" options={{ headerShown: false }} />
    </Stack>
  );
}
