// app/(tabs)/leaderboard.tsx - Leaderboard Screen with Rankings and Competition
import { useAppStore } from '@/store';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock leaderboard data - in production, this would come from your backend
const mockLeaderboardData = [
  {
    rank: 1,
    user: {
      id: '1',
      username: 'SavingsStar',
      points: 2450,
      totalSavings: 1250.75,
      streak: 28,
      avatar: '🌟',
      level: 8
    },
    score: 2450,
    change: 2 // Moved up 2 positions
  },
  {
    rank: 2,
    user: {
      id: '2',
      username: 'BudgetBoss',
      points: 2380,
      totalSavings: 1180.50,
      streak: 25,
      avatar: '👑',
      level: 7
    },
    score: 2380,
    change: -1 // Moved down 1 position
  },
  {
    rank: 3,
    user: {
      id: '3',
      username: 'MoneyMaster',
      points: 2250,
      totalSavings: 1050.25,
      streak: 22,
      avatar: '💎',
      level: 7
    },
    score: 2250,
    change: 1 // Moved up 1 position
  },
  {
    rank: 4,
    user: {
      id: 'demo_user',
      username: 'demo_user',
      points: 1850,
      totalSavings: 750.00,
      streak: 15,
      avatar: '🎯',
      level: 5
    },
    score: 1850,
    change: 0 // No change
  },
  {
    rank: 5,
    user: {
      id: '5',
      username: 'ChallengeChamp',
      points: 1720,
      totalSavings: 680.75,
      streak: 18,
      avatar: '🚀',
      level: 5
    },
    score: 1720,
    change: 3 // Moved up 3 positions
  },
  {
    rank: 6,
    user: {
      id: '6',
      username: 'FrugalFriend',
      points: 1650,
      totalSavings: 620.50,
      streak: 12,
      avatar: '🎈',
      level: 4
    },
    score: 1650,
    change: -2 // Moved down 2 positions
  },
  {
    rank: 7,
    user: {
      id: '7',
      username: 'SmartSaver',
      points: 1580,
      totalSavings: 580.25,
      streak: 20,
      avatar: '🧠',
      level: 4
    },
    score: 1580,
    change: 1 // Moved up 1 position
  },
  {
    rank: 8,
    user: {
      id: '8',
      username: 'WiseWallet',
      points: 1420,
      totalSavings: 520.00,
      streak: 8,
      avatar: '🦉',
      level: 4
    },
    score: 1420,
    change: -1 // Moved down 1 position
  }
];

const mockFriends = [
  { id: '2', username: 'BudgetBoss', points: 2380, avatar: '👑' },
  { id: '5', username: 'ChallengeChamp', points: 1720, avatar: '🚀' },
  { id: '7', username: 'SmartSaver', points: 1580, avatar: '🧠' }
];

interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    points: number;
    totalSavings: number;
    streak: number;
    avatar: string;
    level: number;
  };
  score: number;
  change: number;
}

export default function LeaderboardScreen() {
  const { currentUser } = useAppStore();
  const [leaderboardData, setLeaderboardData] = (React as any).useState([]);
  const [friends] = (React as any).useState(mockFriends);
  const [selectedTab, setSelectedTab] = (React as any).useState('global');
  const [loading, setLoading] = (React as any).useState(true);
  const [refreshing, setRefreshing] = (React as any).useState(false);

  (React as any).useEffect(() => {
    loadLeaderboard();
  }, [selectedTab]);

  const loadLeaderboard = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, use mock data
      // In production, you'd fetch from your backend:
      // const response = await fetch(`/api/leaderboard?type=${selectedTab}`);
      // const data = await response.json();
      
      if (selectedTab === 'global') {
        setLeaderboardData(mockLeaderboardData);
      } else {
        // Filter to show only friends
        const friendsLeaderboard = mockLeaderboardData.filter((entry: any) => 
          friends.some((friend: any) => friend.id === entry.user.id) || entry.user.id === currentUser?.id
        ).map((entry: any, index: number) => ({ ...entry, rank: index + 1 }));
        setLeaderboardData(friendsLeaderboard);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      Alert.alert('Error', 'Failed to load leaderboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadLeaderboard(true);
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '➖';
  };

  const getRankChangeColor = (change: number) => {
    if (change > 0) return '#10b981'; // Green
    if (change < 0) return '#ef4444'; // Red
    return '#64748b'; // Gray
  };

  const renderLeaderboardEntry = (entry: LeaderboardEntry, index: number) => {
    const isCurrentUser = entry.user.id === currentUser?.id;
    const isTopThree = entry.rank <= 3;

    return (
      <View
        key={entry.user.id}
        style={[
          styles.leaderboardEntry,
          isCurrentUser && styles.currentUserEntry,
          isTopThree && styles.topThreeEntry
        ]}
      >
        <View style={styles.rankSection}>
          <Text style={[styles.rankText, isTopThree && styles.topThreeRank]}>
            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
          </Text>
        </View>

        <View style={styles.avatarSection}>
          <Text style={styles.avatar}>{entry.user.avatar}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{entry.user.level}</Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.username, isCurrentUser && styles.currentUserText]}>
            {entry.user.username}
            {isCurrentUser && ' (You)'}
          </Text>
          <View style={styles.statsRow}>
            <Text style={styles.points}>{entry.user.points.toLocaleString()} pts</Text>
            <Text style={styles.savings}>${entry.user.totalSavings.toFixed(2)} saved</Text>
          </View>
          <Text style={styles.streak}>🔥 {entry.user.streak} day streak</Text>
        </View>

        <View style={styles.changeSection}>
          <Text style={styles.changeIcon}>{getRankChangeIcon(entry.change)}</Text>
          {entry.change !== 0 && (
            <Text style={[styles.changeText, { color: getRankChangeColor(entry.change) }]}>
              {Math.abs(entry.change)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderTabSelector = () => (
    <View style={styles.tabSelector}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'global' && styles.activeTab]}
        onPress={() => setSelectedTab('global')}
      >
        <Text style={[styles.tabText, selectedTab === 'global' && styles.activeTabText]}>
          🌍 Global
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'friends' && styles.activeTab]}
        onPress={() => setSelectedTab('friends')}
      >
        <Text style={[styles.tabText, selectedTab === 'friends' && styles.activeTabText]}>
          👥 Friends
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderUserRankCard = () => {
    const userEntry = leaderboardData.find((entry: any) => entry.user.id === currentUser?.id);
    if (!userEntry) return null;

    return (
      <View style={styles.userRankCard}>
        <Text style={styles.userRankTitle}>Your Current Ranking</Text>
        <View style={styles.userRankContent}>
          <View style={styles.userRankLeft}>
            <Text style={styles.userRankPosition}>#{userEntry.rank}</Text>
            <Text style={styles.userRankLabel}>Position</Text>
          </View>
          <View style={styles.userRankMiddle}>
            <Text style={styles.userRankPoints}>{userEntry.user.points.toLocaleString()}</Text>
            <Text style={styles.userRankLabel}>Points</Text>
          </View>
          <View style={styles.userRankRight}>
            <Text style={[styles.userRankChange, { color: getRankChangeColor(userEntry.change) }]}>
              {userEntry.change > 0 ? '+' : ''}{userEntry.change}
            </Text>
            <Text style={styles.userRankLabel}>Change</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {renderTabSelector()}
        {renderUserRankCard()}

        <View style={styles.leaderboardContainer}>
          <Text style={styles.sectionTitle}>
            {selectedTab === 'global' ? '🌍 Global Rankings' : '👥 Friends Rankings'}
          </Text>
          
          {leaderboardData.map((entry: any, index: number) => renderLeaderboardEntry(entry, index))}
        </View>

        <View style={styles.competitionInfo}>
          <Text style={styles.competitionTitle}>🏆 Weekly Competition</Text>
          <Text style={styles.competitionText}>
            Compete with friends and climb the leaderboard! Complete challenges to earn points and boost your ranking.
          </Text>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>This Week&apos;s Rewards:</Text>
            <Text style={styles.rewardItem}>🥇 1st Place: 500 bonus points</Text>
            <Text style={styles.rewardItem}>🥈 2nd Place: 300 bonus points</Text>
            <Text style={styles.rewardItem}>🥉 3rd Place: 200 bonus points</Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: 'white',
  },
  userRankCard: {
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
  userRankTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  userRankContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userRankLeft: {
    alignItems: 'center',
  },
  userRankMiddle: {
    alignItems: 'center',
  },
  userRankRight: {
    alignItems: 'center',
  },
  userRankPosition: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  userRankPoints: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  userRankChange: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userRankLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  leaderboardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
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
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  currentUserEntry: {
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  topThreeEntry: {
    backgroundColor: '#fef3c7',
  },
  rankSection: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
  },
  topThreeRank: {
    fontSize: 20,
  },
  avatarSection: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 32,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  currentUserText: {
    color: '#3b82f6',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 2,
  },
  points: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  savings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  streak: {
    fontSize: 12,
    color: '#64748b',
  },
  changeSection: {
    alignItems: 'center',
    width: 40,
  },
  changeIcon: {
    fontSize: 16,
  },
  changeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  competitionInfo: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  competitionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  competitionText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  rewardInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  rewardItem: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
});
