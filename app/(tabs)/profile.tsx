// app/(tabs)/profile.tsx - User Profile Screen
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
  username: string;
  email: string;
  joinDate: string;
  totalPoints: number;
  totalSavings: number;
  challengesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
  achievements: string[];
  preferences: {
    notifications: boolean;
    dailyReminders: boolean;
    weeklyReports: boolean;
  };
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    username: 'demo_user',
    email: 'demo@wildcardwallet.com',
    joinDate: '2024-01-01',
    totalPoints: 0,
    totalSavings: 0,
    challengesCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    favoriteCategory: 'Food & Dining',
    achievements: [],
    preferences: {
      notifications: true,
      dailyReminders: true,
      weeklyReports: false,
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadProfile();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error loading current user:', error);
    }
  };

  const loadProfile = async () => {
    try {
      // Load user stats from AsyncStorage
      const userStats = await AsyncStorage.getItem('userStats');
      const savedProfile = await AsyncStorage.getItem('userProfile');
      const currentUserData = await AsyncStorage.getItem('currentUser');
      
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        
        // Merge user data with stats
        const stats = userStats ? JSON.parse(userStats) : {};
        const profileData = savedProfile ? JSON.parse(savedProfile) : {};
        
        const mergedProfile: UserProfile = {
          username: user.username,
          email: user.email,
          joinDate: stats.joinDate || new Date().toISOString(),
          totalPoints: stats.totalPoints || 0,
          totalSavings: stats.totalSavings || 0,
          challengesCompleted: stats.challengesCompleted || 0,
          currentStreak: stats.currentStreak || 0,
          longestStreak: stats.longestStreak || 0,
          favoriteCategory: profileData.favoriteCategory || 'Food & Dining',
          achievements: profileData.achievements || [],
          preferences: {
            notifications: profileData.preferences?.notifications ?? true,
            dailyReminders: profileData.preferences?.dailyReminders ?? true,
            weeklyReports: profileData.preferences?.weeklyReports ?? false,
          }
        };
        
        setProfile(mergedProfile);
        setEditUsername(mergedProfile.username);
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const saveProfile = async (newProfile: UserProfile) => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.log('Error saving profile:', error);
    }
  };

  const handleSaveUsername = () => {
    if (!editUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    const updatedProfile = { ...profile, username: editUsername.trim() };
    saveProfile(updatedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Username updated successfully!');
  };

  const togglePreference = (key: keyof UserProfile['preferences']) => {
    const updatedProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        [key]: !profile.preferences[key]
      }
    };
    saveProfile(updatedProfile);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all user data
              await AsyncStorage.removeItem('currentUser');
              await AsyncStorage.removeItem('userStats');
              await AsyncStorage.removeItem('userProfile');
              await AsyncStorage.removeItem('challengeHistory');
              await AsyncStorage.removeItem('savingsData');
              
              // Navigate to welcome screen
              router.replace('/');
              
              // Show success message
              Alert.alert('Signed Out', 'You have been successfully signed out.');
            } catch (error) {
              console.log('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will reset all your stats, challenges, and savings data. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              // Reset user stats
              const initialStats = {
                totalPoints: 0,
                totalSavings: 0,
                challengesCompleted: 0,
                currentStreak: 0,
                completedToday: false,
                joinDate: new Date().toISOString()
              };
              await AsyncStorage.setItem('userStats', JSON.stringify(initialStats));
              
              // Reset profile data
              const resetProfile = {
                ...profile,
                totalPoints: 0,
                totalSavings: 0,
                challengesCompleted: 0,
                currentStreak: 0,
                longestStreak: 0,
                achievements: []
              };
              await AsyncStorage.setItem('userProfile', JSON.stringify(resetProfile));
              
              // Clear challenge history
              await AsyncStorage.removeItem('challengeHistory');
              await AsyncStorage.removeItem('savingsData');
              
              setProfile(resetProfile);
              Alert.alert('Success', 'Your progress has been reset!');
            } catch (error) {
              console.log('Error resetting progress:', error);
              Alert.alert('Error', 'Failed to reset progress. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getAchievementEmoji = (achievement: string) => {
    switch (achievement) {
      case 'First Saver': return '🎯';
      case 'Week Warrior': return '⚔️';
      case 'Streak Master': return '🔥';
      case 'Money Maven': return '💰';
      default: return '🏆';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'Food & Dining': return '🍕';
      case 'Transportation': return '🚗';
      case 'Entertainment': return '🎬';
      case 'Shopping': return '🛍️';
      default: return '💰';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>👤 Profile</Text>
          <Text style={styles.subtitle}>Manage your account and preferences</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <Text style={styles.avatar}>🎯</Text>
            <View style={styles.profileInfo}>
              {isEditing ? (
                <View style={styles.editSection}>
                  <TextInput
                    style={styles.usernameInput}
                    value={editUsername}
                    onChangeText={setEditUsername}
                    placeholder="Enter username"
                    maxLength={20}
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsEditing(false);
                        setEditUsername(profile.username);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSaveUsername}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.usernameSection}>
                  <Text style={styles.username}>{profile.username}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.editButtonText}>✏️ Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.email}>{profile.email}</Text>
              <Text style={styles.joinDate}>
                Member since {new Date(profile.joinDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${profile.totalSavings}</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.challengesCompleted}</Text>
              <Text style={styles.statLabel}>Challenges</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          <View style={styles.achievementsContainer}>
            {profile.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Text style={styles.achievementEmoji}>
                  {getAchievementEmoji(achievement)}
                </Text>
                <Text style={styles.achievementName}>{achievement}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Favorite Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❤️ Favorite Category</Text>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>
              {getCategoryEmoji(profile.favoriteCategory)}
            </Text>
            <Text style={styles.categoryName}>{profile.favoriteCategory}</Text>
            <Text style={styles.categoryDescription}>
              You save the most money in this category!
            </Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Preferences</Text>
          <View style={styles.preferencesContainer}>
            <TouchableOpacity
              style={styles.preferenceItem}
              onPress={() => togglePreference('notifications')}
            >
              <View style={styles.preferenceLeft}>
                <Text style={styles.preferenceEmoji}>🔔</Text>
                <Text style={styles.preferenceName}>Push Notifications</Text>
              </View>
              <View style={[
                styles.toggle,
                profile.preferences.notifications && styles.toggleActive
              ]}>
                <Text style={styles.toggleText}>
                  {profile.preferences.notifications ? 'ON' : 'OFF'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.preferenceItem}
              onPress={() => togglePreference('dailyReminders')}
            >
              <View style={styles.preferenceLeft}>
                <Text style={styles.preferenceEmoji}>⏰</Text>
                <Text style={styles.preferenceName}>Daily Reminders</Text>
              </View>
              <View style={[
                styles.toggle,
                profile.preferences.dailyReminders && styles.toggleActive
              ]}>
                <Text style={styles.toggleText}>
                  {profile.preferences.dailyReminders ? 'ON' : 'OFF'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.preferenceItem}
              onPress={() => togglePreference('weeklyReports')}
            >
              <View style={styles.preferenceLeft}>
                <Text style={styles.preferenceEmoji}>📊</Text>
                <Text style={styles.preferenceName}>Weekly Reports</Text>
              </View>
              <View style={[
                styles.toggle,
                profile.preferences.weeklyReports && styles.toggleActive
              ]}>
                <Text style={styles.toggleText}>
                  {profile.preferences.weeklyReports ? 'ON' : 'OFF'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📤 Export Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleResetProgress}>
            <Text style={styles.actionButtonText}>🔄 Reset Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleLogout}>
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              🚪 Sign Out
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 48,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  usernameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: '#3b82f6',
  },
  editSection: {
    marginBottom: 8,
  },
  usernameInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  achievementEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    textAlign: 'center',
  },
  categoryCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#1e40af',
    textAlign: 'center',
  },
  preferencesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  preferenceName: {
    fontSize: 16,
    color: '#1e293b',
  },
  toggle: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#10b981',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerButtonText: {
    color: '#dc2626',
  },
});
