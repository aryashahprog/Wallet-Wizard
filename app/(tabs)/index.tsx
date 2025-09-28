import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTodaysAIChallenge } from '../../scripts/challenge';
import { useAuth } from '../_layout';

interface Challenge {
  name: string;
  emoji: string;
  description: string;
  estimatedSavings: number;
  points: number;
  difficulty: string;
  category: string;
}

export default function DailySpinScreen() {
  const { userPreferences } = useAuth();
  
  const [currentChallenge, setCurrentChallenge] = React.useState<Challenge | null>(null);
  const [acceptedChallenge, setAcceptedChallenge] = React.useState<Challenge | null>(null);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [hasSpunToday, setHasSpunToday] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showCompletionModal, setShowCompletionModal] = React.useState(false);
  const [completionReward, setCompletionReward] = React.useState({ points: 0, savings: 0 });
  const [userStats, setUserStats] = React.useState({
    totalPoints: 125,
    totalSavings: 0,
    challengesCompleted: 0,
    currentStreak: 0
  });

  React.useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    setIsLoading(true);
    // Simulate loading user data
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  const handleSpin = async () => {
    if (hasSpunToday && !currentChallenge) {
      Alert.alert("Already Spun!", "You've already spun today. Come back tomorrow!");
      return;
    }

    setIsSpinning(true);
    
    try {
      const selectedCategories = userPreferences?.selectedSavingsCategories || [];
      console.log('🎯 Generating challenge for categories:', selectedCategories);
      
      const aiChallenge = await getTodaysAIChallenge(selectedCategories);
      
      if (!aiChallenge) {
        throw new Error('Failed to generate challenge');
      }

      console.log('✅ Generated challenge:', aiChallenge.name);

      // Simulate spinning animation
      setTimeout(() => {
        setCurrentChallenge(aiChallenge);
        setIsSpinning(false);
        setHasSpunToday(true);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating challenge:', error);
      setIsSpinning(false);
      Alert.alert('Error', 'Failed to generate challenge. Please try again.');
    }
  };

  const handleAcceptChallenge = () => {
    if (!currentChallenge) return;

    setAcceptedChallenge(currentChallenge);
    
    Alert.alert(
      "Challenge Accepted! 🎯", 
      `Great! Complete "${currentChallenge.name}" to earn ${currentChallenge.points} points!`
    );
  };

  const handleRejectChallenge = () => {
    if (!currentChallenge) return;

    Alert.alert(
      "Maybe Tomorrow! 🔄", 
      "No worries! Come back tomorrow for a fresh challenge."
    );
    
    setCurrentChallenge(null);
    setHasSpunToday(false);
  };

  const handleCompleteChallenge = () => {
    if (!acceptedChallenge) return;

    const actualSavings = acceptedChallenge.estimatedSavings;
    const pointsEarned = acceptedChallenge.points;
    
    setUserStats(prev => ({
      totalPoints: prev.totalPoints + pointsEarned,
      totalSavings: prev.totalSavings + actualSavings,
      challengesCompleted: prev.challengesCompleted + 1,
      currentStreak: prev.currentStreak + 1
    }));
    
    setCompletionReward({ points: pointsEarned, savings: actualSavings });
    setShowCompletionModal(true);

    // Reset for next day
    setAcceptedChallenge(null);
    setCurrentChallenge(null);
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
        
        {/* Header Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Ready to save money?</Text>
          <Text style={styles.subtitleText}>
            Spin the wheel for your daily AI-powered challenge!
          </Text>
          
          <View style={styles.pointsDisplay}>
            <Text style={styles.pointsText}>⭐ {userStats.totalPoints} Points</Text>
            <Text style={styles.savingsText}>💰 ${userStats.totalSavings} Saved</Text>
          </View>
        </View>

        {/* Spin Wheel Section */}
        <View style={styles.spinSection}>
          <View style={styles.spinWheel}>
            <Text style={styles.wheelEmoji}>
              {isSpinning ? '🎯' : '🎲'}
            </Text>
          </View>
          
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

        {/* Current Challenge Card */}
        {currentChallenge && !acceptedChallenge && (
          <View style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeEmoji}>{currentChallenge.emoji}</Text>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeName}>{currentChallenge.name}</Text>
                <View style={styles.challengeMetadata}>
                  <Text 
                    style={[styles.difficulty, { color: getDifficultyColor(currentChallenge.difficulty) }]}
                  >
                    {currentChallenge.difficulty}
                  </Text>
                  <Text style={styles.savings}>${currentChallenge.estimatedSavings} potential</Text>
                  <Text style={styles.points}>⭐ {currentChallenge.points} pts</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.challengeDescription}>{currentChallenge.description}</Text>
            
            <View style={styles.challengeActions}>
              <TouchableOpacity 
                style={styles.acceptButton} 
                onPress={handleAcceptChallenge}
              >
                <Text style={styles.acceptButtonText}>✅ Accept Challenge</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.rejectButton} 
                onPress={handleRejectChallenge}
              >
                <Text style={styles.rejectButtonText}>❌ Skip Today</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Active Challenge Card */}
        {acceptedChallenge && (
          <View style={styles.activeCard}>
            <Text style={styles.activeTitle}>🎯 Today&aps;s Active Challenge</Text>
            <Text style={styles.activeChallenge}>
              {acceptedChallenge.emoji} {acceptedChallenge.name}
            </Text>
            <Text style={styles.activeDescription}>{acceptedChallenge.description}</Text>
            <Text style={styles.rewardText}>
              Complete for ⭐ {acceptedChallenge.points} points & ${acceptedChallenge.estimatedSavings} saved!
            </Text>
            
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleCompleteChallenge}
            >
              <Text style={styles.completeButtonText}>✅ Mark as Completed!</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* AI Info Section */}
        {userPreferences?.selectedSavingsCategories?.length! > 0 && (
          <View style={styles.aiSection}>
            <Text style={styles.aiTitle}>🤖 AI-Powered Challenges</Text>
            <Text style={styles.aiText}>
              Focus Areas: {userPreferences?.selectedSavingsCategories
                ?.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
                .join(', ')}
            </Text>
            <Text style={styles.aiHint}>
              Challenges are personalized based on your preferences
            </Text>
          </View>
        )}

        {/* Stats Section */}
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
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Leaderboard Preview */}
        <View style={styles.leaderboardPreview}>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.leaderboardTitle}>🏆 Your Ranking</Text>
            <TouchableOpacity onPress={() => Alert.alert('Leaderboard', 'Check the Leaderboard tab!')}>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.rankCard}>
            <View style={styles.rankInfo}>
              <Text style={styles.rankPosition}>#4</Text>
              <Text style={styles.rankLabel}>Global Rank</Text>
            </View>
            <View style={styles.rankDivider} />
            <View style={styles.rankInfo}>
              <Text style={styles.rankPoints}>{userStats.totalPoints}</Text>
              <Text style={styles.rankLabel}>Points</Text>
            </View>
            <View style={styles.rankDivider} />
            <View style={styles.rankInfo}>
              <Text style={styles.rankChange}>+2</Text>
              <Text style={styles.rankLabel}>This Week</Text>
            </View>
          </View>
          
          <Text style={styles.leaderboardHint}>
            💡 Complete more challenges to climb higher!
          </Text>
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
              <Text style={styles.modalSubtitle}>Amazing! You earned:</Text>
              
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
    shadowOffset: { width: 0, height: 8 },
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
    shadowOffset: { width: 0, height: 4 },
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
  challengeCard: {
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
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  challengeMetadata: {
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
  challengeDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 24,
  },
  challengeActions: {
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
  activeCard: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  activeTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  activeChallenge: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  activeDescription: {
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
    textAlign: 'center',
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
  aiSection: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  aiText: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 4,
  },
  aiHint: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  leaderboardPreview: {
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
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  rankCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  rankInfo: {
    flex: 1,
    alignItems: 'center',
  },
  rankDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  rankPosition: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  rankPoints: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  rankChange: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  rankLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  leaderboardHint: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
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