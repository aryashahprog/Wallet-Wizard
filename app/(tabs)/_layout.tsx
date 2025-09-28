// app/(tabs)/_layout.tsx - Main App Tab Navigation Layout
import { Tabs } from 'expo-router';
import { Platform, Text } from 'react-native';

// You can use Expo's built-in icons or install react-native-vector-icons
// For now, using emoji icons (works everywhere)
const TabBarIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => {
  return (
    <Text style={{ 
      fontSize: 24, 
      opacity: focused ? 1 : 0.6,
    }}>
      {emoji}
    </Text>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // This removes the header completely
        tabBarActiveTintColor: '#3b82f6', // Blue color for active tab
        tabBarInactiveTintColor: '#64748b', // Gray color for inactive tabs
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      {/* Home Tab - Daily Spin */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily Spin',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon emoji="🎲" focused={focused} />
          ),
        }}
      />

      {/* Explore Tab - Browse Challenges */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon emoji="🔍" focused={focused} />
          ),
        }}
      />

      {/* Profile Tab - User Settings & Logout */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}