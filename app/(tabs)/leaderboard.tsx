// app/(tabs)/leaderboard.tsx - Friends Leaderboard with Groups
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Friend {
  id: string;
  username: string;
  points: number;
  totalSavings: number;
  streak: number;
  avatar: string;
}

interface Group {
  id: string;
  name: string;
  inviteCode: string;
  members: Friend[];
  createdBy: string;
  createdAt: Date;
}

const mockFriends: Friend[] = [
  {
    id: '1',
    username: 'demo_user',
    points: 247,
    totalSavings: 1284,
    streak: 5,
    avatar: '🎯'
  },
  {
    id: '2',
    username: 'saver_sarah',
    points: 189,
    totalSavings: 956,
    streak: 3,
    avatar: '💰'
  },
  {
    id: '3',
    username: 'budget_bob',
    points: 312,
    totalSavings: 1567,
    streak: 8,
    avatar: '🏆'
  },
  {
    id: '4',
    username: 'frugal_fiona',
    points: 278,
    totalSavings: 1402,
    streak: 6,
    avatar: '🌟'
  },
  {
    id: '5',
    username: 'penny_pincher',
    points: 156,
    totalSavings: 823,
    streak: 2,
    avatar: '🎲'
  },
];

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'groups'>('friends');
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [currentUser] = useState<Friend>({
    id: 'current',
    username: 'demo_user',
    points: 247,
    totalSavings: 1284,
    streak: 5,
    avatar: '🎯'
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const savedGroups = await AsyncStorage.getItem('userGroups');
      if (savedGroups) {
        setGroups(JSON.parse(savedGroups));
      }
    } catch (error) {
      console.log('Error loading groups:', error);
    }
  };

  const saveGroups = async (newGroups: Group[]) => {
    try {
      await AsyncStorage.setItem('userGroups', JSON.stringify(newGroups));
      setGroups(newGroups);
    } catch (error) {
      console.log('Error saving groups:', error);
    }
  };

  const generateInviteCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      inviteCode: generateInviteCode(),
      members: [currentUser],
      createdBy: currentUser.id,
      createdAt: new Date(),
    };

    const updatedGroups = [...groups, newGroup];
    saveGroups(updatedGroups);

    Alert.alert(
      'Group Created! 🎉',
      `Group "${newGroupName}" created!\n\nInvite Code: ${newGroup.inviteCode}\n\nShare this code with friends to join your group!`,
      [{ text: 'Copy Code', onPress: () => {/* Copy to clipboard */} }]
    );

    setNewGroupName('');
    setShowCreateGroup(false);
  };

  const joinGroup = () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }

    // Mock joining logic - in real app, this would be an API call
    const mockGroup: Group = {
      id: Date.now().toString(),
      name: `${inviteCode}'s Squad`,
      inviteCode: inviteCode.toUpperCase(),
      members: [...mockFriends, currentUser].sort((a, b) => b.points - a.points),
      createdBy: 'someone',
      createdAt: new Date(),
    };

    const updatedGroups = [...groups, mockGroup];
    saveGroups(updatedGroups);

    Alert.alert(
      'Joined Group! 🚀',
      `Successfully joined "${mockGroup.name}"!\n\nTime to climb the leaderboard!`
    );

    setInviteCode('');
    setShowJoinGroup(false);
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#f59e0b'; // Gold
      case 2: return '#94a3b8'; // Silver
      case 3: return '#cd7c2f'; // Bronze
      default: return '#64748b';
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  const renderFriendItem = ({ item, index }: { item: Friend; index: number }) => {
    const rank = index + 1;
    const isCurrentUser = item.id === currentUser.id;
    
    return (
      <View style={[styles.friendItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankSection}>
          <Text style={[styles.rankText, { color: getRankColor(rank) }]}>
            {getRankEmoji(rank)}
          </Text>
        </View>
        
        <View style={styles.avatarSection}>
          <Text style={styles.avatar}>{item.avatar}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.username, isCurrentUser && styles.currentUserText]}>
            {item.username} {isCurrentUser && '(You)'}
          </Text>
          <Text style={styles.userStats}>
            💰 ${item.totalSavings} saved • 🔥 {item.streak} day streak
          </Text>
        </View>
        
        <View style={styles.pointsSection}>
          <Text style={styles.pointsText}>⭐ {item.points}</Text>
        </View>
      </View>
    );
  };

  const renderGroupItem = ({ item }: { item: Group }) => (
    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.memberCount}>{item.members.length} members</Text>
      </View>
      
      <View style={styles.inviteCodeSection}>
        <Text style={styles.inviteCodeLabel}>Invite Code:</Text>
        <Text style={styles.inviteCodeText}>{item.inviteCode}</Text>
      </View>
      
      <Text style={styles.topMemberText}>🏆 Leader: {item.members[0]?.username} ({item.members[0]?.points} pts)</Text>
      
      <TouchableOpacity style={styles.viewGroupButton}>
        <Text style={styles.viewGroupButtonText}>View Full Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );

  const sortedFriends = [...friends].sort((a, b) => b.points - a.points);
  
  const globalLeaderboard = [
    { id: 'global_1', username: 'savings_legend', points: 1247, totalSavings: 6543, streak: 25, avatar: '👑' },
    { id: 'global_2', username: 'money_master', points: 1189, totalSavings: 5987, streak: 22, avatar: '💎' },
    { id: 'global_3', username: 'budget_boss', points: 1034, totalSavings: 5234, streak: 18, avatar: '🎯' },
    ...sortedFriends.slice(0, 3).map((friend, index) => ({
      ...friend,
      id: `global_friend_${index}`
    })),
  ].sort((a, b) => b.points - a.points);

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'global' && styles.activeTab]}
          onPress={() => setActiveTab('global')}
        >
          <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>
            🌍 Global
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            👥 Friends
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
            🏆 Groups
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'global' && (
          <View>
            <Text style={styles.sectionTitle}>🌍 Global Leaderboard</Text>
            <Text style={styles.sectionSubtitle}>Top savers worldwide</Text>
            <FlatList
              data={globalLeaderboard}
              renderItem={renderFriendItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === 'friends' && (
          <View>
            <Text style={styles.sectionTitle}>👥 Friends Leaderboard</Text>
            <Text style={styles.sectionSubtitle}>Compete with your friends</Text>
            <FlatList
              data={sortedFriends}
              renderItem={renderFriendItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
            
            <TouchableOpacity style={styles.addFriendButton}>
              <Text style={styles.addFriendButtonText}>➕ Add Friends</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'groups' && (
          <View>
            <Text style={styles.sectionTitle}>🏆 My Groups</Text>
            <Text style={styles.sectionSubtitle}>Compete in group challenges</Text>
            
            <View style={styles.groupActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowCreateGroup(true)}
              >
                <Text style={styles.actionButtonText}>🏗️ Create Group</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowJoinGroup(true)}
              >
                <Text style={styles.actionButtonText}>🚀 Join Group</Text>
              </TouchableOpacity>
            </View>

            {groups.length > 0 ? (
              <FlatList
                data={groups}
                renderItem={renderGroupItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No groups yet!</Text>
                <Text style={styles.emptyStateSubtext}>
                  Create a group or join one with an invite code to start competing with friends!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Create Group Modal */}
      <Modal
        visible={showCreateGroup}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateGroup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🏗️ Create New Group</Text>
            <Text style={styles.modalSubtitle}>Give your savings squad a name!</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Group name (e.g., College Savers)"
              value={newGroupName}
              onChangeText={setNewGroupName}
              maxLength={30}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreateGroup(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.createButton} onPress={createGroup}>
                <Text style={styles.createButtonText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Join Group Modal */}
      <Modal
        visible={showJoinGroup}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowJoinGroup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🚀 Join Group</Text>
            <Text style={styles.modalSubtitle}>Enter the invite code to join!</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Invite code (e.g., ABC123)"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
              maxLength={6}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowJoinGroup(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.joinButton} onPress={joinGroup}>
                <Text style={styles.joinButtonText}>Join Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    backgroundColor: '#f0f9ff',
  },
  rankSection: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarSection: {
    marginRight: 12,
  },
  avatar: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  currentUserText: {
    color: '#3b82f6',
  },
  userStats: {
    fontSize: 12,
    color: '#64748b',
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  addFriendButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addFriendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  memberCount: {
    fontSize: 14,
    color: '#64748b',
  },
  inviteCodeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  inviteCodeLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  inviteCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
  topMemberText: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 16,
  },
  viewGroupButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewGroupButtonText: {
    color: '#64748b',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});