// app/(tabs)/index.tsx - Enhanced Daily Spin Screen with Points System
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
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

// Enhanced spin rules with points and savings data
const spinRules = [
  {
    id: 1,
    name: "Cinderella Snack Ban",
    emoji: "🕰️",
    description: "No delivery after 8pm",
    estimatedSavings: { min: 8, max: 15 },
    points: 15,
    difficulty: "Easy"
  },
  {
    id: 2,
    name: "Walkies Wallet",
    emoji: "🚶‍♂️",
    description: "Walk if destination < 1 mile",
    estimatedSavings: { min: 12, max: 18 },
    points: 25,
    difficulty: "Medium"
  },
  {
    id: 3,
    name: "Fridge First",
    emoji: "🧊",
    description: "Cook using two existing ingredients",
    estimatedSavings: { min: 15, max: 25 },
    points: 30,
    difficulty: "Medium"
  },
  {
    id: 4,
    name: "Ride Chain Breaker",
    emoji: "🚗",
    description: "No back-to-back rideshares",
    estimatedSavings: { min: 20, max: 30 },
    points: 40,
    difficulty: "Hard"
  },
  {
    id: 5,
    name: "BYO Brew",
    emoji: "☕",
    description: "No café unless you brewed once at home",
    estimatedSavings: { min: 6, max: 12 },
    points: 12,
    difficulty: "Easy"
  },
  {
    id: 6,
    name: "Leftover Lottery",
    emoji: "🍱",
    description: "One meal must be leftovers",
    estimatedSavings: { min: 10, max: 16 },
    points: 18,
    difficulty: "Easy"
  },
  {
    id: 7,
    name: "Swap & Save",
    emoji: "🔄",
    description: "Pick store-brand for one item",
    estimatedSavings: { min: 3, max: 8 },
    points: 10,
    difficulty: "Easy"
  },
  {
    id: 8,
    name: "Inbox Ice Bath",
    emoji: "📧",
    description: "Unsubscribe from 1 promo email",
    estimatedSavings: { min: 5, max: 20 },
    points: 22,
    difficulty: "Easy"
  },
  {
    id: 9,
    name: "Snack Stack Cap",
    emoji: "🍿",
    description: "Max two snacks today",
    estimatedSavings: { min: 4, max: 10 },
    points: 15,
    difficulty: "Medium"
  },
  {
    id: 10,
    name: "Cash-Only Challenge",
    emoji: "💵",
    description: "One purchase must be cash",
    estimatedSavings: { min: 5, max: 15 },
    points: 20,
    difficulty: "Medium"
  }
];

interface DailyRule {
  id: number;
  name: string;
  emoji: string;
  description: string;
  estimatedSavings: { min: number; max: number };
  points: number;
  difficulty: string;
}

interface UserStats {
  totalPoints: number;
  totalSavings: number;
  challengesCompleted: number;
  currentStreak: number;
  completedToday: boolean;
}

export default function DailySpinScreen() {
  const [currentRule, setCurrentRule] = useState<DailyRule | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [spinAnimation] = useState(new Animated.Value(0));
  const [acceptedRule, setAcceptedRule] = useState<DailyRule | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 247,
    totalSavings: 1284,
    challengesCompleted: 12,
    currentStreak: 5,
    completedToday: false
  });
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionReward, setCompletionReward] = useState({ points: 0, savings: 0 });

  // Load user stats on component mount
  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('userStats');
      if (stats) {
        setUserStats(JSON.parse(stats));
      }
    } catch (error) {
      console.log('Error loading user stats:', error);
    }
  };

  const saveUserStats = async (newStats: UserStats) => {
    try {
      await AsyncStorage.setItem('userStats', JSON.stringify(newStats));
      setUserStats(newStats);
    } catch (error) {
      console.log('Error saving user stats:', error);
    }
  };

  const handleSpin = () => {
    if (hasSpunToday && !acceptedRule) {
      Alert.alert("Already Spun!", "You've already spun today. Come back tomorrow for a new challenge!");
      return;
    }

    setIsSpinning(true);
    
    // Animate the spin
    Animated.sequence([
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Pick a random rule
      const randomRule = spinRules[Math.floor(Math.random() * spinRules.length)];
      setCurrentRule(randomRule);
      setIsSpinning(false);
      setHasSpunToday(true);
      
      // Reset animation
      spinAnimation.setValue(0);
    });
  };

  const handleAcceptRule = () => {
    if (currentRule) {
      setAcceptedRule(currentRule);
      Alert.alert(
        "Challenge Accepted! 🎯", 
        `Great! You've accepted "${currentRule.name}". Complete it to earn ${currentRule.points} points!`
      );
    }
  };

  const handleCompleteChallenge = async () => {
    if (!acceptedRule) return;

    // Calculate actual savings (random between min and max)
    const actualSavings = Math.floor(
      Math.random() * (acceptedRule.estimatedSavings.max - acceptedRule.estimatedSavings.min + 1) + 
      acceptedRule.estimatedSavings.min
    );

    // Update user stats
    const newStats: UserStats = {
      totalPoints: userStats.totalPoints + acceptedRule.points,
      totalSavings: userStats.totalSavings + actualSavings,
      challengesCompleted: userStats.challengesCompleted + 1,
      currentStreak: userStats.currentStreak + 1,
      completedToday: true
    };

    await saveUserStats(newStats);
    
    // Save to challenge history
    await saveChallengeToHistory(acceptedRule, actualSavings);
    
    // Update savings data
    await updateSavingsData(acceptedRule, actualSavings);
    
    // Show completion reward
    setCompletionReward({ points: acceptedRule.points, savings: actualSavings });
    setShowCompletionModal(true);

    // Reset for next day
    setAcceptedRule(null);
    setCurrentRule(null);
    setHasSpunToday(false);
  };

  const saveChallengeToHistory = async (rule: DailyRule, savings: number) => {
    try {
      const historyData = await AsyncStorage.getItem('challengeHistory');
      const history = historyData ? JSON.parse(historyData) : [];
      
      const newEntry = {
        id: Date.now().toString(),
        name: rule.name,
        emoji: rule.emoji,
        description: rule.description,
        completedDate: new Date().toISOString().split('T')[0],
        pointsEarned: rule.points,
        savingsAmount: savings,
        difficulty: rule.difficulty,
        status: 'completed'
      };
      
      history.unshift(newEntry); // Add to beginning
      await AsyncStorage.setItem('challengeHistory', JSON.stringify(history));
    } catch (error) {
      console.log('Error saving challenge to history:', error);
    }
  };

  const updateSavingsData = async (rule: DailyRule, savings: number) => {
    try {
      const savingsData = await AsyncStorage.getItem('savingsData');
      const data = savingsData ? JSON.parse(savingsData) : {
        totalSaved: 0,
        thisMonth: 0,
        lastMonth: 0,
        categories: {
          food: 0,
          transport: 0,
          entertainment: 0,
          shopping: 0,
          other: 0,
        },
        recentSavings: []
      };
      
      // Update totals
      data.totalSaved += savings;
      data.thisMonth += savings;
      
      // Determine category based on rule name
      let category = 'other';
      if (rule.name.includes('Snack') || rule.name.includes('Fridge') || rule.name.includes('Brew') || rule.name.includes('Leftover')) {
        category = 'food';
      } else if (rule.name.includes('Walk') || rule.name.includes('Ride')) {
        category = 'transport';
      } else if (rule.name.includes('Entertainment') || rule.name.includes('Movie')) {
        category = 'entertainment';
      } else if (rule.name.includes('Shopping') || rule.name.includes('Store')) {
        category = 'shopping';
      }
      
      data.categories[category] += savings;
      
      // Add to recent savings
      const newSaving = {
        id: Date.now().toString(),
        amount: savings,
        category: category,
        date: new Date().toISOString().split('T')[0],
        description: `${rule.name} - ${rule.description}`
      };
      
      data.recentSavings.unshift(newSaving);
      if (data.recentSavings.length > 10) {
        data.recentSavings = data.recentSavings.slice(0, 10); // Keep only last 10
      }
      
      await AsyncStorage.setItem('savingsData', JSON.stringify(data));
    } catch (error) {
      console.log('Error updating savings data:', error);
    }
  };

  const handleRejectRule = () => {
    Alert.alert(
      "Maybe Tomorrow! 🔄", 
      "No worries! Come back tomorrow for a fresh challenge."
    );
    setCurrentRule(null);
    setHasSpunToday(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Welcome Section with Points */}
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
          <Animated.View 
            style={[
              styles.spinWheel,
              { transform: [{ rotate: spin }] }
            ]}
          >
            <Text style={styles.wheelEmoji}>🎲</Text>
          </Animated.View>
          
          <TouchableOpacity 
            style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]} 
            onPress={handleSpin}
            disabled={isSpinning}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? "🌟 SPINNING..." : "🎲 SPIN FOR TODAY'S CHALLENGE!"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Rule Card */}
        {currentRule && (
          <View style={styles.ruleCard}>
            <View style={styles.ruleHeader}>
              <Text style={styles.ruleEmoji}>{currentRule.emoji}</Text>
              <View style={styles.ruleInfo}>
                <Text style={styles.ruleName}>{currentRule.name}</Text>
                <View style={styles.ruleMetadata}>
                  <Text 
                    style={[
                      styles.difficulty, 
                      { color: getDifficultyColor(currentRule.difficulty) }
                    ]}
                  >
                    {currentRule.difficulty}
                  </Text>
                  <Text style={styles.savings}>
                    ${currentRule.estimatedSavings.min}-{currentRule.estimatedSavings.max} savings
                  </Text>
                  <Text style={styles.points}>⭐ {currentRule.points} pts</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.ruleDescription}>{currentRule.description}</Text>
            
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

        {/* Accepted Rule Status */}
        {acceptedRule && (
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>🎯 Today's Active Challenge</Text>
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

        {/* Quick Stats */}
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

        {/* Completion Modal */}
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
    backgroundColor: '#white',
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