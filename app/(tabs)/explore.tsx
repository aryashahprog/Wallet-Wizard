// app/(tabs)/explore.tsx - Enhanced Explore Screen with Backend Integration
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

interface Rule {
  id: string;
  name: string;
  emoji: string;
  description: string;
  estimatedSavings: { min: number; max: number };
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export default function ExploreScreen() {
  const [rules, setRules] = (React as any).useState([]);
  const [selectedCategory, setSelectedCategory] = (React as any).useState('All');
  const [loading, setLoading] = (React as any).useState(true);
  const [refreshing, setRefreshing] = (React as any).useState(false);
  const [categories, setCategories] = (React as any).useState(['All']);

  (React as any).useEffect(() => {
    loadRules();
  }, [selectedCategory]);

  const loadRules = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // For Expo Go demo, use sample data instead of API calls
      const sampleRules: Rule[] = [
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
        },
        {
          id: '4',
          name: 'Cancel Unused Subscriptions',
          emoji: '📱',
          description: 'Review and cancel subscriptions you no longer use',
          estimatedSavings: { min: 15, max: 50 },
          points: 40,
          difficulty: 'Medium',
          category: 'Entertainment'
        },
        {
          id: '5',
          name: 'Buy Generic Brands',
          emoji: '🏷️',
          description: 'Choose generic or store brands over name brands',
          estimatedSavings: { min: 5, max: 20 },
          points: 25,
          difficulty: 'Easy',
          category: 'Shopping'
        },
        {
          id: '6',
          name: 'Energy Saving Challenge',
          emoji: '💡',
          description: 'Turn off lights and unplug devices when not in use',
          estimatedSavings: { min: 8, max: 18 },
          points: 20,
          difficulty: 'Easy',
          category: 'Utilities'
        }
      ];

      const sampleCategories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities'];

      // Filter rules by category
      const filteredRules = selectedCategory === 'All' 
        ? sampleRules 
        : sampleRules.filter(rule => rule.category === selectedCategory);

      setRules(filteredRules);
      setCategories(['All', ...sampleCategories]);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error loading rules:', error);
      Alert.alert('Error', 'Failed to load challenges. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadRules(true);
  };

  const filteredRules = selectedCategory === 'All' 
    ? rules 
    : rules.filter((rule: Rule) => rule.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleRulePress = async (rule: Rule) => {
    Alert.alert(
      `${rule.emoji} ${rule.name}`,
      `${rule.description}\n\nEstimated Savings: ${rule.estimatedSavings.min}-${rule.estimatedSavings.max}\nPoints: ${rule.points}\nDifficulty: ${rule.difficulty}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Try This Challenge', 
          onPress: () => tryCustomChallenge(rule)
        }
      ]
    );
  };

  const tryCustomChallenge = async (rule: Rule) => {
    try {
      // In a real app, you might create a custom challenge session
      // For now, just show a success message
      Alert.alert(
        'Challenge Added!',
        `"${rule.name}" has been added to your available challenges. You can spin to get this challenge or similar ones!`
      );
    } catch (error) {
      console.error('Error adding custom challenge:', error);
      Alert.alert('Error', 'Failed to add challenge. Please try again.');
    }
  };

  const proposeNewRule = () => {
    Alert.alert(
      'Propose New Rule',
      'Feature coming soon! You will be able to suggest new money-saving challenges that will be reviewed and potentially added to the app.',
      [{ text: 'OK' }]
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore Challenges</Text>
          <Text style={styles.subtitle}>
            Discover new ways to save money and earn points
          </Text>
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

        {/* Rules List */}
        <View style={styles.rulesContainer}>
          {filteredRules.map((rule: Rule) => (
            <TouchableOpacity
              key={rule.id}
              style={styles.ruleCard}
              onPress={() => handleRulePress(rule)}
            >
              <View style={styles.ruleHeader}>
                <Text style={styles.ruleEmoji}>{rule.emoji}</Text>
                <View style={styles.ruleInfo}>
                  <Text style={styles.ruleName}>{rule.name}</Text>
                  <View style={styles.ruleMetadata}>
                    <Text 
                      style={[
                        styles.difficulty, 
                        { color: getDifficultyColor(rule.difficulty) }
                      ]}
                    >
                      {rule.difficulty}
                    </Text>
                    <Text style={styles.category}>{rule.category}</Text>
                  </View>
                </View>
                <View style={styles.pointsContainer}>
                  <Text style={styles.points}>{rule.points}</Text>
                  <Text style={styles.pointsLabel}>pts</Text>
                </View>
              </View>
              
              <Text style={styles.ruleDescription}>{rule.description}</Text>
              
              <Text style={styles.savings}>
                Potential savings: ${rule.estimatedSavings.min}-{rule.estimatedSavings.max}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {filteredRules.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No challenges found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try selecting a different category or refresh to see new challenges.
            </Text>
          </View>
        )}

        {/* Propose New Rule Button */}
        <TouchableOpacity 
          style={styles.proposeButton}
          onPress={proposeNewRule}
        >
          <Text style={styles.proposeButtonText}>💡 Propose New Challenge</Text>
        </TouchableOpacity>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Challenge Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{rules.length}</Text>
              <Text style={styles.statLabel}>Total Challenges</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                ${rules.length > 0 ? Math.max(...rules.map((r: Rule) => r.estimatedSavings.max)) : 0}
              </Text>
              <Text style={styles.statLabel}>Max Savings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {rules.length > 0 ? Math.max(...rules.map((r: Rule) => r.points)) : 0}
              </Text>
              <Text style={styles.statLabel}>Max Points</Text>
            </View>
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
  content: {
    flex: 1,
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
  header: {
    padding: 20,
    paddingBottom: 16,
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
    lineHeight: 24,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCategoryButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  selectedCategoryText: {
    color: 'white',
  },
  rulesContainer: {
    paddingHorizontal: 20,
  },
  ruleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    alignItems: 'flex-start',
    marginBottom: 12,
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
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  category: {
    fontSize: 12,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
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
  ruleDescription: {
    fontSize: 16,
    color: '#64748b',
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
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  proposeButton: {
    backgroundColor: '#8b5cf6',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  proposeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
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
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});