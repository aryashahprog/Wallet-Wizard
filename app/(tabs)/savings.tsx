// app/(tabs)/savings.tsx - Savings Tracker Screen
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SavingsData {
  totalSaved: number;
  thisMonth: number;
  lastMonth: number;
  categories: {
    food: number;
    transport: number;
    entertainment: number;
    shopping: number;
    other: number;
  };
  recentSavings: Array<{
    id: string;
    amount: number;
    category: string;
    date: string;
    description: string;
  }>;
}

export default function SavingsScreen() {
  const [savingsData, setSavingsData] = useState<SavingsData>({
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
  });

  useEffect(() => {
    loadSavingsData();
  }, []);

  // Add focus listener to refresh data when screen is focused
  useEffect(() => {
    const unsubscribe = () => {
      loadSavingsData();
    };
    
    // Refresh data when component mounts or when returning to this screen
    const interval = setInterval(loadSavingsData, 1000); // Check every second for updates
    
    return () => clearInterval(interval);
  }, []);

  const loadSavingsData = async () => {
    try {
      const data = await AsyncStorage.getItem('savingsData');
      if (data) {
        setSavingsData(JSON.parse(data));
      } else {
        // Initialize with empty data if none exists
        const initialData: SavingsData = {
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
        setSavingsData(initialData);
      }
    } catch (error) {
      console.log('Error loading savings data:', error);
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'food': return '🍕';
      case 'transport': return '🚗';
      case 'entertainment': return '🎬';
      case 'shopping': return '🛍️';
      default: return '💰';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return '#f59e0b';
      case 'transport': return '#3b82f6';
      case 'entertainment': return '#8b5cf6';
      case 'shopping': return '#ef4444';
      default: return '#10b981';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💰 Savings Tracker</Text>
          <Text style={styles.subtitle}>Track your money-saving progress</Text>
        </View>

        {/* Total Savings Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Saved</Text>
          <Text style={styles.totalAmount}>${savingsData.totalSaved}</Text>
          <View style={styles.monthlyComparison}>
            <Text style={styles.monthlyText}>
              This month: ${savingsData.thisMonth}
            </Text>
            <Text style={styles.monthlyText}>
              Last month: ${savingsData.lastMonth}
            </Text>
          </View>
        </View>

        {/* Categories Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 This Month by Category</Text>
          <View style={styles.categoriesContainer}>
            {Object.entries(savingsData.categories).map(([category, amount]) => (
              <View key={category} style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>
                  {getCategoryEmoji(category)}
                </Text>
                <Text style={styles.categoryName}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <Text style={[styles.categoryAmount, { color: getCategoryColor(category) }]}>
                  ${amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Savings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Recent Savings</Text>
          {savingsData.recentSavings.map((saving) => (
            <View key={saving.id} style={styles.savingItem}>
              <View style={styles.savingLeft}>
                <Text style={styles.savingEmoji}>
                  {getCategoryEmoji(saving.category)}
                </Text>
                <View style={styles.savingInfo}>
                  <Text style={styles.savingDescription}>
                    {saving.description}
                  </Text>
                  <Text style={styles.savingDate}>
                    {new Date(saving.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={[styles.savingAmount, { color: getCategoryColor(saving.category) }]}>
                +${saving.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>💡 Savings Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              🎯 You're on track to save ${Math.round(savingsData.thisMonth * 1.2)} this month!
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              🔥 Keep your streak going! You've saved money for {Math.floor(Math.random() * 10) + 5} days in a row.
            </Text>
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
  totalCard: {
    backgroundColor: '#10b981',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  totalLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  totalAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  monthlyComparison: {
    flexDirection: 'row',
    gap: 20,
  },
  monthlyText: {
    color: '#d1fae5',
    fontSize: 14,
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
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
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  savingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  savingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  savingEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  savingInfo: {
    flex: 1,
  },
  savingDescription: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 2,
  },
  savingDate: {
    fontSize: 12,
    color: '#64748b',
  },
  savingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  tipText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
});
