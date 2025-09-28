import React from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generatePersonalizedChallenges } from '../../scripts/challenge';
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

export default function ExploreScreen() {
  const { userPreferences } = useAuth();
  
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [categories, setCategories] = React.useState(['All']);

  React.useEffect(() => {
    loadChallenges();
  }, []);

  React.useEffect(() => {
    if (challenges.length > 0) {
      updateCategories();
    }
  }, [challenges]);

  const loadChallenges = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const selectedCategories = userPreferences?.selectedSavingsCategories || [];
      const aiChallenges = await generatePersonalizedChallenges(selectedCategories, 8);
      
      if (aiChallenges && aiChallenges.length > 0) {
        setChallenges(aiChallenges);
      } else {
        const fallbackChallenges: Challenge[] = [
          {
            name: 'Skip the coffee shop today',
            emoji: '☕',
            description: 'Make your morning coffee at home instead of buying it',
            estimatedSavings: 6,
            points: 15,
            difficulty: 'Easy',
            category: 'food'
          },
          {
            name: 'Walk to nearby errands',
            emoji: '🚶',
            description: 'Walk to destinations within 1 mile instead of driving',
            estimatedSavings: 4,
            points: 12,
            difficulty: 'Easy',
            category: 'transportation'
          }
        ];
        setChallenges(fallbackChallenges);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error loading challenges:', error);
      Alert.alert('Error', 'Failed to load challenges. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateCategories = () => {
    const uniqueCategories = Array.from(new Set(challenges.map(challenge => challenge.category)));
    const formattedCategories = uniqueCategories.map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1)
    );
    setCategories(['All', ...formattedCategories]);
  };

  const onRefresh = () => {
    loadChallenges(true);
  };

  const filteredChallenges = selectedCategory === 'All' 
    ? challenges 
    : challenges.filter(challenge => 
        challenge.category.toLowerCase() === selectedCategory.toLowerCase() ||
        challenge.category === selectedCategory
      );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleChallengePress = (challenge: Challenge) => {
    Alert.alert(
      `${challenge.emoji} ${challenge.name}`,
      `${challenge.description}\n\nEstimated Savings: $${challenge.estimatedSavings}\nPoints: ${challenge.points}\nDifficulty: ${challenge.difficulty}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Try This Challenge', 
          onPress: () => tryChallenge(challenge)
        }
      ]
    );
  };

  const tryChallenge = (challenge: Challenge) => {
    Alert.alert(
      'Challenge Noted!',
      `"${challenge.name}" has been noted. Similar challenges may appear in your daily spins based on your preferences!`
    );
  };

  const generateMoreChallenges = async () => {
    Alert.alert(
      'Generate More Challenges',
      'Generate more personalized challenges based on your preferences?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: () => loadChallenges(true) }
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text style={styles.loadingText}>Generating personalized challenges...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Explore Challenges</Text>
            <Text style={styles.subtitle}>
              Discover AI-generated challenges personalized for you
            </Text>
            {userPreferences?.selectedSavingsCategories?.length! > 0 && (
              <View style={styles.aiIndicator}>
                <Text style={styles.aiText}>
                  Personalized for: {userPreferences?.selectedSavingsCategories
                    ?.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
                    .join(', ')}
                </Text>
              </View>
            )}
          </View>

          {/* Category Filter */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            {categories.map((category: string) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Challenges List */}
          <View style={styles.challengesContainer}>
            {filteredChallenges.map((challenge: Challenge, index: number) => (
              <TouchableOpacity
                key={`${challenge.name}-${index}`}
                style={styles.challengeCard}
                onPress={() => handleChallengePress(challenge)}
              >
                <View style={styles.challengeHeader}>
                  <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeName}>{challenge.name}</Text>
                    <View style={styles.challengeMetadata}>
                      <Text 
                        style={[
                          styles.difficulty, 
                          { color: getDifficultyColor(challenge.difficulty) }
                        ]}
                      >
                        {challenge.difficulty}
                      </Text>
                      <Text style={styles.category}>
                        {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.pointsContainer}>
                    <Text style={styles.points}>{challenge.points}</Text>
                    <Text style={styles.pointsLabel}>pts</Text>
                  </View>
                </View>
                
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
                
                <Text style={styles.savings}>
                  Potential savings: ${challenge.estimatedSavings}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Empty State */}
          {filteredChallenges.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No challenges found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try selecting a different category or refresh to generate new challenges.
              </Text>
            </View>
          )}

          {/* Generate More Button */}
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateMoreChallenges}
          >
            <Text style={styles.generateButtonText}>🤖 Generate More Challenges</Text>
          </TouchableOpacity>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.statsTitle}>Challenge Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{challenges.length}</Text>
                <Text style={styles.statLabel}>Total Challenges</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  ${challenges.length > 0 ? Math.max(...challenges.map(c => c.estimatedSavings)) : 0}
                </Text>
                <Text style={styles.statLabel}>Max Savings</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {challenges.length > 0 ? Math.max(...challenges.map(c => c.points)) : 0}
                </Text>
                <Text style={styles.statLabel}>Max Points</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f0ff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b46c1',
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: '500',
  },
  aiIndicator: {
    backgroundColor: '#f3f0ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  aiText: {
    fontSize: 14,
    color: '#6b46c1',
    fontWeight: '500',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCategoryButton: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  challengesContainer: {
    paddingHorizontal: 20,
  },
  challengeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    alignItems: 'flex-start',
    marginBottom: 12,
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
  pointsContainer: {
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  pointsLabel: {
    fontSize: 10,
    color: '#f59e0b',
  },
  challengeDescription: {
    fontSize: 16,
    color: '#6b46c1',
    marginBottom: 8,
    lineHeight: 24,
  },
  savings: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b46c1',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: '#8b5cf6',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statsSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});