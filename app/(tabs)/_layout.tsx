// app/(tabs)/_layout.tsx - Updated Tab Navigation with Leaderboard
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

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
          headerTitle: '🎲 Wallet Wizard',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ 
              fontSize: 24, 
              opacity: focused ? 1 : 0.6,
            }}>
              🎲
            </Text>
          ),
        }}
      />

      {/* Leaderboard Tab - NEW! */}
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          headerTitle: '🏆 Leaderboards',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ 
              fontSize: 24, 
              opacity: focused ? 1 : 0.6,
            }}>
              🏆
            </Text>
          ),
        }}
      />

      {/* Savings Tab - Track Progress */}
      <Tabs.Screen
        name="savings"
        options={{
          title: 'My Savings',
          headerTitle: '💰 Savings Tracker',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ 
              fontSize: 24, 
              opacity: focused ? 1 : 0.6,
            }}>
              💰
            </Text>
          ),
        }}
      />


      {/* Profile Tab - User Settings */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: '👤 Profile',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ 
              fontSize: 24, 
              opacity: focused ? 1 : 0.6,
            }}>
              👤
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}