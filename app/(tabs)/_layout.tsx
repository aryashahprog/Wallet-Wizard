// app/(tabs)/_layout.tsx - Main App Tab Navigation Layout
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

// You can use Expo's built-in icons or install react-native-vector-icons
// For now, using emoji icons (works everywhere)
const TabBarIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => {
  return (
    <span style={{ 
      fontSize: 24, 
      opacity: focused ? 1 : 0.6,
      transform: focused ? 'scale(1.1)' : 'scale(1)',
      transition: 'all 0.2s'
    }}>
      {emoji}
    </span>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
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
        headerStyle: {
          backgroundColor: '#f8fafc',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        },
        headerTintColor: '#1e293b',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}
    >
      {/* Home Tab - Daily Spin */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily Spin',
          headerTitle: '🎲 Wildcard Wallet',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon emoji="🎲" focused={focused} />
          ),
        }}
      />

      {/* Savings Tab - Track Progress */}
      <Tabs.Screen
        name="savings"
        options={{
          title: 'My Savings',
          headerTitle: '💰 Savings Tracker',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon emoji="💰" focused={focused} />
          ),
        }}
      />

      {/* History Tab - Past Challenges */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerTitle: '📊 Challenge History',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon emoji="📊" focused={focused} />
          ),
        }}
      />

      {/* Profile Tab - User Settings */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: '👤 Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon emoji="👤" focused={focused} />
          ),
        }}
      />

      {/* Achievements Tab - Badges & Rewards */}
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Rewards',
          headerTitle: '🏆 Achievements',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon emoji="🏆" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
