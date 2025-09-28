import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useState } from 'react';
import 'react-native-reanimated';
import AuthScreen from './AuthScreen';
import InitialChart from './InitialChart';

import { useColorScheme } from '@/hooks/use-color-scheme';

type User = { username: string; password: string; accountId?: string; };

const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  const [pieChart, setPieChart] = useState<any>(null);

  if (!user) {
    return <AuthScreen onUserCreated={(u: User) => setUser(u)} />
  }
  if (!pieChart) {
    return <InitialChart 
      user={user} 
      onContinue={() => setPieChart(true)}
    />
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f3f0ff',
            },
            headerTintColor: '#6b46c1',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false 
            }} 
          />
          
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal', 
              title: 'Settings' 
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}