import { Stack } from 'expo-router';


export default function MovieLayout() {
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>

    );
}
