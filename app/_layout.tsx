import { Stack } from 'expo-router';
import AuthProvider from './context/AuthContext';
import TaskProvider from './context/TaskContext';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import authStorage from './services/authStorage';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authentication token on app load
    const checkAuth = async () => {
      try {
        const token = await authStorage.getToken();
        setIsAuthenticated(!!token);
      } catch (error) {
        // console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  if (isLoading) {
    // Return a loading screen
    return null;
  }

  return (isAuthenticated != undefined && isAuthenticated != null &&
    <PaperProvider>
      <AuthProvider>
        <TaskProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {!isAuthenticated ?
              <Stack.Screen name="index" options={{ title: 'Login' }} />
              :
              <>
                <Stack.Screen name="HomeScreen" options={{ title: 'Home' }} />
                <Stack.Screen name="TaskDetailScreen" options={{ title: 'Task Details', headerShown: true }} />
                <Stack.Screen name="UserManagementScreen" options={{ title: 'User Management' }} />
              </>
            }
          </Stack>
        </TaskProvider>
      </AuthProvider>
    </PaperProvider >
  );
}
