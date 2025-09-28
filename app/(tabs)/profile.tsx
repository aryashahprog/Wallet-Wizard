import { useAppStore } from '@/store';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {

  const { currentUser, userStats, reset } = useAppStore();

  /*const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/CreateUser');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };*/

  const handleResetData = () => {
    Alert.alert(
      'Reset Data',
      'This will clear all your progress and statistics. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            reset();
            Alert.alert('Success', 'Your data has been reset.');
          }
        }
      ]
    );
  };

  const getLevelProgress = () => {
    const pointsForNextLevel = (userStats.level || 1) * 100;
    const currentLevelPoints = userStats.totalPoints % 100;
    return (currentLevelPoints / pointsForNextLevel) * 100;
  };

  const getNextLevelPoints = () => {
    const pointsForNextLevel = (userStats.level || 1) * 100;
    const currentLevelPoints = userStats.totalPoints % 100;
    return pointsForNextLevel - currentLevelPoints;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>🎯</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{userStats.level || 1}</Text>
            </View>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.username}>{currentUser?.username || 'User'}</Text>
            <Text style={styles.email}>{currentUser?.email || 'No email'}</Text>
            
            <View style={styles.levelProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${getLevelProgress()}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {getNextLevelPoints()} points to level {(userStats.level || 1) + 1}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>📊 Your Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalPoints || 0}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${userStats.totalSavings || 0}</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.challengesCompleted || 0}</Text>
              <Text style={styles.statLabel}>Challenges</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.currentStreak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>🎯</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>First Spin</Text>
                <Text style={styles.achievementDesc}>Complete your first daily challenge</Text>
              </View>
              <Text style={styles.achievementStatus}>✅</Text>
            </View>
            
            <View style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>🔥</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>Streak Master</Text>
                <Text style={styles.achievementDesc}>Maintain a 7-day streak</Text>
              </View>
              <Text style={styles.achievementStatus}>
                {(userStats.currentStreak || 0) >= 7 ? '✅' : '🔒'}
              </Text>
            </View>
            
            <View style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>💰</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>Big Saver</Text>
                <Text style={styles.achievementDesc}>Save $100 in total</Text>
              </View>
              <Text style={styles.achievementStatus}>
                {(userStats.totalSavings || 0) >= 100 ? '✅' : '🔒'}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => {
            Alert.alert('Coming Soon', 'Notification settings will be available in a future update.');
          }}>
            <Text style={styles.settingIcon}>🔔</Text>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Notifications</Text>
              <Text style={styles.settingDesc}>Daily reminders and updates</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => {
            Alert.alert('Coming Soon', 'Privacy settings will be available in a future update.');
          }}>
            <Text style={styles.settingIcon}>🔒</Text>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Privacy</Text>
              <Text style={styles.settingDesc}>Control your data and visibility</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleResetData}>
            <Text style={styles.settingIcon}>🗑️</Text>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Reset Data</Text>
              <Text style={styles.settingDesc}>Clear all progress and start over</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Wallet Wizard v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with ❤️ for better saving habits</Text>
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
    padding: 16,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarSection: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  levelProgress: {
    width: '100%',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  achievementsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  achievementEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  achievementStatus: {
    fontSize: 20,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  settingArrow: {
    fontSize: 20,
    color: '#94a3b8',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
});
