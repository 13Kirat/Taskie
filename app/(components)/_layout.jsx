import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AddTask" options={{ title: 'Add Task' }} />
            <Stack.Screen name="ImagePicker" options={{ title: 'Image Picker' }} />
            <Stack.Screen name="TaskItem" options={{ title: 'Task Item' }} />
            <Stack.Screen name="TaskList" options={{ title: 'Task List' }} />
            <Stack.Screen name="UserPicker" options={{ title: 'User Picker' }} />
        </Stack>
    );
}
