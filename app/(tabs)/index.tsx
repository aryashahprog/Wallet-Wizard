// app/(tabs)/index.tsx - Daily Spin Screen with Complete Backend Integration
import { useAppStore } from '@/app/state/store';
import { SavingsPieChart } from '@/components/ui/PieChart';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DailyRule {
  id: string;
  name: string;
  emoji: string;
  description: string;
  estimatedSavings: { min: number; max: number };
  points: number;
  difficulty: string;
  category?: string;
  activeForDate?: string;
}

interface UserStats {
  totalPoints: number;
  totalSavings: number;
  challengesCompleted: number;
  currentStreak: number;
  completedToday: boolean;
}

interface SpinSession {
  sessionId: string;
  challengeId: string;
  status: 'proposed' | 'accepted' | 'completed' | 'rejected';
  estimatedSavings: number;
  actualSavings?: number;
  pointsEarned?: number;
}

export default function DailySpinScreen() {
  // Zustand store
  const { diff, setDiff, acceptDiff, rejectDiff } = useAppStore();
  
  // Local state
  const [currentRule, setCurrentRule] = (React as any).useState(null);
  const [isSpinning, setIsSpinning] = (React as any).useState(false);
  const [hasSpunToday, setHasSpunToday] = (React as any).useState(false);
  const [spinAnimation] = (React as any).useState(new Animated.Value(0));
  const [acceptedRule, setAcceptedRule] = (React as any).useState(null);
  const [userStats, setUserStats] = (React as any).useState({
    totalPoints: 0,
    totalSavings: 0,
    challengesCompleted: 0,
    currentStreak: 0,
    completedToday: false
  });
  const [showCompletionModal, setShowCompletionModal] = (React as any).useState(false);
  const [completionReward, setCompletionReward] = (React as any).useState({ points: 0, savings: 0 });
  const [currentSession, setCurrentSession] = (React as any).useState(null);
  const [isLoading, setIsLoading] = (React as any).useState(true);

  // Mock customer ID - in production, get from auth context
  const CUSTOMER_ID = 'demo_customer_id';

  (React as any).useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadUserStats(),
        checkTodaysChallenge()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      // For Expo Go demo, use sample data instead of API calls
      const sampleStats = {
        totalPoints: 125,
        totalSavings: 45,
        challengesCompleted: 8,
        currentStreak: 3,
        completedToday: false
      };

      setUserStats(sampleStats);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const checkTodaysChallenge = async () => {
    try {
      // For Expo Go demo, simulate no existing challenge
      setHasSpunToday(false);
      setCurrentSession(null);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error checking today\'s challenge:', error);
    }
  };

  const loadChallengeDetails = async (challengeId: string) => {
    try {
      // In a real app, you might have a challenges endpoint to get full details
      // For now, we'll use the rule data from the diff or generate it
      const ruleData = diff?.rule || await getChallengeById(challengeId);
      if (ruleData) {
        // Convert Rule to DailyRule by adding description and ensuring required fields
        const dailyRule: DailyRule = {
          ...ruleData,
          description: ruleData.name, // Use name as description since Rule doesn't have description
          estimatedSavings: ruleData.estimatedSavings || { min: 0, max: 0 }, // Provide default if missing
          points: ruleData.points || 0, // Provide default if missing
          difficulty: ruleData.difficulty || 'Easy' // Provide default if missing
        };
        setAcceptedRule(dailyRule);
      }
    } catch (error) {
      console.error('Error loading challenge details:', error);
    }
  };

  const getChallengeById = async (challengeId: string): Promise<DailyRule | null> => {
    // This would typically fetch from your challenges API
    // For now, return a default rule
    return {
      id: challengeId,
      name: "Today's Challenge",
      emoji: "🎯",
      description: "Complete your daily challenge",
      estimatedSavings: { min: 5, max: 15 },
      points: 20,
      difficulty: "Medium"
    };
  };

  const handleSpin = async () => {
    if (hasSpunToday && !currentSession) {
      Alert.alert("Already Spun!", "You've already spun today. Come back tomorrow for a new challenge!");
      return;
    }

    setIsSpinning(true);
    
    try {
      // For Expo Go demo, use sample challenge data
      const sampleChallenges: DailyRule[] = [
        {
          id: '1',
          name: 'Skip Coffee Shop',
          emoji: '☕',
          description: 'Make coffee at home instead of buying from a coffee shop',
          estimatedSavings: { min: 5, max: 15 },
          points: 20,
          difficulty: 'Easy',
          category: 'Food & Dining'
        },
        {
          id: '2',
          name: 'Walk Instead of Drive',
          emoji: '🚶',
          description: 'Walk to nearby destinations instead of driving',
          estimatedSavings: { min: 3, max: 8 },
          points: 15,
          difficulty: 'Easy',
          category: 'Transportation'
        },
        {
          id: '3',
          name: 'Cook at Home',
          emoji: '🍳',
          description: 'Prepare meals at home instead of ordering takeout',
          estimatedSavings: { min: 10, max: 25 },
          points: 30,
          difficulty: 'Medium',
          category: 'Food & Dining'
        }
      ];

      // Randomly select a challenge
      const proposedRule = sampleChallenges[Math.floor(Math.random() * sampleChallenges.length)];
      const sim = {
        todaySavingsEstimate: Math.floor(Math.random() * (proposedRule.estimatedSavings.max - proposedRule.estimatedSavings.min + 1)) + proposedRule.estimatedSavings.min
      };

      // Animate the spin
      Animated.sequence([
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Set the diff buffer for Cedar-style accept/reject
        setDiff({
          rule: proposedRule,
          sim: sim,
          reminder: {
            date: `${new Date().toISOString().split('T')[0]}T19:30:00`,
            message: `Reminder: ${proposedRule.name} tonight - ${proposedRule.points} points available!`
          }
        });

        setCurrentRule(proposedRule);
        setIsSpinning(false);
        setHasSpunToday(true);
        
        // Create mock spin session
        const mockSession: SpinSession = {
          sessionId: `session_${Date.now()}`,
          challengeId: proposedRule.id,
          status: 'proposed',
          estimatedSavings: sim.todaySavingsEstimate
        };
        setCurrentSession(mockSession);
        
        // Reset animation
        spinAnimation.setValue(0);
      });
    } catch (error) {
      console.error('Error spinning:', error);
      setIsSpinning(false);
      Alert.alert('Error', 'Failed to get today\'s challenge. Please try again.');
    }
  };

  const createSpinSession = async (rule: DailyRule, estimatedSavings: number) => {
    try {
      // For Expo Go demo, create mock session
      const mockSession: SpinSession = {
        sessionId: `session_${Date.now()}`,
        challengeId: rule.id,
        status: 'proposed',
        estimatedSavings: estimatedSavings
      };
      setCurrentSession(mockSession);
    } catch (error) {
      console.error('Error creating spin session:', error);
    }
  };

  const handleAcceptRule = async () => {
    if (!currentRule || !currentSession) return;

    try {
      // For Expo Go demo, simulate accepting challenge
      const updatedSession: SpinSession = {
        ...currentSession,
        status: 'accepted'
      };
      setCurrentSession(updatedSession);
      setAcceptedRule(currentRule);
      
      // Accept the diff in Zustand store
      acceptDiff(new Date().toISOString().split('T')[0]);
      
      Alert.alert(
        "Challenge Accepted! 🎯", 
        `Great! You've accepted "${currentRule.name}". Complete it to earn ${currentRule.points} points!`
      );
    } catch (error) {
      console.error('Error accepting challenge:', error);
      Alert.alert('Error', 'Failed to accept challenge. Please try again.');
    }
  };

  const handleCompleteChallenge = async () => {
    if (!acceptedRule || !currentSession) return;

    try {
      // Calculate actual savings (random between min and max)
      const actualSavings = Math.floor(
        Math.random() * (acceptedRule.estimatedSavings.max - acceptedRule.estimatedSavings.min + 1) + 
        acceptedRule.estimatedSavings.min
      );

      // For Expo Go demo, simulate completing challenge
      const updatedSession: SpinSession = {
        ...currentSession,
        status: 'completed',
        actualSavings: actualSavings,
        pointsEarned: acceptedRule.points
      };
      setCurrentSession(updatedSession);
      
      // Update local stats
      setUserStats({
        totalPoints: userStats.totalPoints + acceptedRule.points,
        totalSavings: userStats.totalSavings + actualSavings,
        challengesCompleted: userStats.challengesCompleted + 1,
        currentStreak: userStats.currentStreak + 1,
        completedToday: true
      });
      
      // Show completion reward
      setCompletionReward({ points: acceptedRule.points, savings: actualSavings });
      setShowCompletionModal(true);

      // Show new badges if any (simulate)
      setTimeout(() => {
        Alert.alert('New Badge Earned! 🏆', 'You earned: Money Saver Badge!');
      }, 2000);

      // Reset for next day
      setAcceptedRule(null);
      setCurrentRule(null);
      setHasSpunToday(false);
    } catch (error) {
      console.error('Error completing challenge:', error);
      Alert.alert('Error', 'Failed to complete challenge. Please try again.');
    }
  };

  const handleRejectRule = async () => {
    if (!currentRule || !currentSession) return;

    try {
      // For Expo Go demo, simulate rejecting challenge
      // Reject the diff in Zustand store
      rejectDiff();
      
      Alert.alert(
        "Maybe Tomorrow! 🔄", 
        "No worries! Come back tomorrow for a fresh challenge."
      );
      setCurrentRule(null);
      setHasSpunToday(false);
      setCurrentSession(null);
    } catch (error) {
      console.error('Error rejecting challenge:', error);
      Alert.alert('Error', 'Failed to reject challenge. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const spin = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading your Wallet Wizard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Enhanced Welcome Section with Points Display */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Ready to save money?</Text>
          <Text style={styles.subtitleText}>
            Spin the wheel for your daily money-saving challenge!
          </Text>
          <View style={styles.pointsDisplay}>
            <Text style={styles.pointsText}>⭐ {userStats.totalPoints} Points</Text>
            <Text style={styles.savingsText}>💰 ${userStats.totalSavings} Saved</Text>
          </View>
        </View>

        {/* Spin Wheel Section */}
        <View style={styles.spinSection}>
          <View 
            style={[
              styles.spinWheel,
              { transform: [{ rotate: spin }] }
            ]}
          >
            <Text style={styles.wheelEmoji}>🎲</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.spinButton, (isSpinning || isLoading) && styles.spinButtonDisabled]} 
            onPress={handleSpin}
            disabled={isSpinning || isLoading}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? "🌟 SPINNING..." : "🎲 SPIN FOR TODAY'S CHALLENGE!"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cedar-style Diff Panel (Enhanced Rule Card) */}
        {diff?.rule && (
          <View style={styles.ruleCard}>
            <View style={styles.ruleHeader}>
              <Text style={styles.ruleEmoji}>{diff.rule.emoji}</Text>
              <View style={styles.ruleInfo}>
                <Text style={styles.ruleName}>{diff.rule.name}</Text>
                <View style={styles.ruleMetadata}>
                  <Text 
                    style={[
                      styles.difficulty, 
                      { color: getDifficultyColor(diff.rule.difficulty || 'Easy') }
                    ]}
                  >
                    {diff.rule.difficulty || 'Easy'}
                  </Text>
                  {diff.sim && (
                    <Text style={styles.savings}>
                      ${diff.sim.todaySavingsEstimate.toFixed(2)} estimated
                    </Text>
                  )}
                  <Text style={styles.points}>⭐ {diff.rule.points} pts</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.ruleDescription}>{diff.rule.name}</Text>
            
            {!acceptedRule && (
              <View style={styles.ruleActions}>
                <TouchableOpacity 
                  style={styles.acceptButton} 
                  onPress={handleAcceptRule}
                >
                  <Text style={styles.acceptButtonText}>✅ Accept Challenge</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.rejectButton} 
                  onPress={handleRejectRule}
                >
                  <Text style={styles.rejectButtonText}>❌ Maybe Tomorrow</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Enhanced Accepted Rule Status with Completion */}
        {acceptedRule && (
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>🎯 Today&apos;s Active Challenge</Text>
            <Text style={styles.statusRule}>
              {acceptedRule.emoji} {acceptedRule.name}
            </Text>
            <Text style={styles.statusDescription}>{acceptedRule.description}</Text>
            <Text style={styles.rewardText}>
              Complete for ⭐ {acceptedRule.points} points!
            </Text>
            
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleCompleteChallenge}
            >
              <Text style={styles.completeButtonText}>✅ Mark as Completed!</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Enhanced Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${userStats.totalSavings}</Text>
            <Text style={styles.statLabel}>Money Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.challengesCompleted}</Text>
            <Text style={styles.statLabel}>Challenges Won</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Savings Breakdown Chart */}
        <View style={styles.chartSection}>
          <SavingsPieChart />
        </View>

        {/* Completion Reward Modal */}
        <Modal
          visible={showCompletionModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCompletionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🎉 Challenge Completed!</Text>
              <Text style={styles.modalSubtitle}>Awesome job! You earned:</Text>
              
              <View style={styles.rewardDisplay}>
                <Text style={styles.rewardPoints}>⭐ +{completionReward.points} Points</Text>
                <Text style={styles.rewardSavings}>💰 +${completionReward.savings} Saved</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowCompletionModal(false)}
              >
                <Text style={styles.modalButtonText}>Keep Saving! 🚀</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  pointsDisplay: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  savingsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  spinSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  spinWheel: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  wheelEmoji: {
    fontSize: 48,
  },
  spinButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  spinButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  spinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ruleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ruleEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  ruleInfo: {
    flex: 1,
  },
  ruleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  ruleMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  difficulty: {
    fontSize: 14,
    fontWeight: '600',
  },
  savings: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  points: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  ruleDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 24,
  },
  ruleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusRule: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusDescription: {
    color: '#d1fae5',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  rewardText: {
    color: '#fef3c7',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  completeButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chartSection: {
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
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
    padding: 30,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
  },
  rewardDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  rewardPoints: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 8,
  },
  rewardSavings: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  modalButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});