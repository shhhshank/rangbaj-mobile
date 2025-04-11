import { Stack } from 'expo-router';


export default function ShowLayout() {
    return (
        <Stack>
            <Stack.Screen name="movie" options={{headerShown:false}}/>
            <Stack.Screen name="show" options={{headerShown:false}}/>
            <Stack.Screen name="[id]" options={{headerShown:false}}/>
            <Stack.Screen name="more" options={{headerShown:false}}/>
        </Stack>

    );
}
