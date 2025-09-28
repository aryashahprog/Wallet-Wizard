import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useState } from 'react';
import 'react-native-reanimated';
import AuthScreen from './AuthScreen';
import InitialChart from './InitialChart';

import { useColorScheme } from '@/hooks/use-color-scheme';

type User = { 
  username: string; 
  password: string; 
  accountId?: string; 
};

type UserPreferences = {
  selectedSavingsCategories: string[];
};

const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  userPreferences: UserPreferences | null;
  setUserPreferences: (preferences: UserPreferences | null) => void;
}>({
  user: null,
  setUser: () => {},
  userPreferences: null,
  setUserPreferences: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  // Handle category selection from InitialChart
  const handleCategoriesSelected = (selectedCategories: string[]) => {
    const preferences: UserPreferences = {
      selectedSavingsCategories: selectedCategories
    };
    setUserPreferences(preferences);
    console.log('User selected categories:', selectedCategories);
  };

  if (!user) {
    return <AuthScreen onUserCreated={(u: User) => setUser(u)} />
  }
  
  if (!userPreferences) {
    return <InitialChart 
      user={user} 
      onContinue={handleCategoriesSelected} // Now expects categories array
    />
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      userPreferences, 
      setUserPreferences 
    }}>
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