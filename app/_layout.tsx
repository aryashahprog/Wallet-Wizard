// app/_layout.tsx - Root Layout for Wildcard Wallet
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add any custom fonts here if you want
    // 'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  (React as any).useEffect(() => {
    if (error) throw error;
  }, [error]);

  (React as any).useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#f8fafc" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8fafc',
          },
          headerTintColor: '#1e293b',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Main authentication screen */}
        <Stack.Screen 
          name="CreateUser" 
          options={{ 
            title: 'Wildcard Wallet',
            headerShown: false // Hide header for login screen
          }} 
        />
        
        {/* Tab navigation (for after login) */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false 
          }} 
        />
        
        {/* Modal screens */}
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            title: 'Settings'
          }} 
        />
      </Stack>
    </>
  );
}
