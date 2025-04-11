import { Stack } from 'expo-router';


export default function ShowLayout() {
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>

    );
}
