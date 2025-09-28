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
    totalPoints: 0,
    totalSavings: 0,
    challengesCompleted: 0,
    currentStreak: 0
  });

  React.useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    setIsLoading(true);
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
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Loading your Wallet Wizard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Ready to save money?</Text>
          <Text style={styles.subtitle}>
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
              {isSpinning ? "🌟 SPINNING..." : "SPIN FOR TODAY'S CHALLENGE!"}
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
                  <Text style={styles.category}>
                    {currentChallenge.category.charAt(0).toUpperCase() + currentChallenge.category.slice(1)}
                  </Text>
                  <Text style={styles.points}>⭐ {currentChallenge.points} pts</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.challengeDescription}>{currentChallenge.description}</Text>
            <Text style={styles.savings}>
              Potential savings: ${currentChallenge.estimatedSavings}
            </Text>
            
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
            <Text style={styles.activeTitle}>🎯 Today&apos;s Active Challenge</Text>
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
            <Text style={styles.aiTitle}>✨ AI-Powered Challenges</Text>
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
          <Text style={styles.statsTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>${userStats.totalSavings}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.challengesCompleted}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userStats.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Leaderboard Preview */}
        <View style={styles.leaderboardCard}>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.leaderboardTitle}>🏆 Your Ranking</Text>
            <TouchableOpacity onPress={() => Alert.alert('Leaderboard', 'Check the Leaderboard tab!')}>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.rankDisplay}>
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
    backgroundColor: '#f3f0ff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b46c1',
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b46c1',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 20,
  },
  pointsDisplay: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    marginBottom: 30,
  },
  spinWheel: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  wheelEmoji: {
    fontSize: 48,
  },
  spinButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  spinButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowColor: '#d1d5db',
  },
  spinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  challengeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    color: '#8b5cf6',
    marginBottom: 4,
  },
  challengeMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  category: {
    fontSize: 12,
    color: '#6b46c1',
    backgroundColor: '#f3f0ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '500',
  },
  points: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  challengeDescription: {
    fontSize: 16,
    color: '#6b46c1',
    marginBottom: 12,
    lineHeight: 24,
  },
  savings: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 20,
  },
  challengeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rejectButtonText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 16,
  },
  activeCard: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  activeTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  activeChallenge: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  activeDescription: {
    color: '#e9d5ff',
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#8b5cf6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  aiSection: {
    backgroundColor: '#f3f0ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b46c1',
    marginBottom: 8,
  },
  aiText: {
    fontSize: 14,
    color: '#6b46c1',
    marginBottom: 4,
    fontWeight: '500',
  },
  aiHint: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  statsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  leaderboardCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    color: '#8b5cf6',
  },
  viewAllText: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  rankDisplay: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    color: '#8b5cf6',
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
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
  },
  leaderboardHint: {
    fontSize: 14,
    color: '#6b7280',
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
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6b46c1',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
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
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});