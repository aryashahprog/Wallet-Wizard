import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { getSpendingData } from '../../scripts/pieData';

interface PieChartComponentProps {
  accountId: string;
}

interface ChartData {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const screenWidth = Dimensions.get('window').width;

const categoryColors = {
  Food: '#ef4444',
  Leisure: '#3b82f6',
  Necessities: '#10b981',
  Transportation: '#f59e0b',
  Other: '#8b5cf6',
};

export default function PieChartComponent({ accountId }: PieChartComponentProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    loadSpendingData();
  }, [accountId]);

  const loadSpendingData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 PieChart accountId:', accountId);
      
      if (!accountId) {
        throw new Error('Account ID is required but was not provided');
      }
      
      const spendingData = await getSpendingData(accountId);

      if (!spendingData) {
        throw new Error('No spending data received');
      }

      const formattedData: ChartData[] = Object.entries(spendingData)
        .filter(([_, amount]) => amount > 0)
        .map(([category, amount]) => ({
          name: category,
          population: amount,
          color: categoryColors[category as keyof typeof categoryColors] || '#9ca3af',
          legendFontColor: '#374151',
          legendFontSize: 14,
        }))
        .sort((a, b) => b.population - a.population);

      const total = formattedData.reduce((sum, item) => sum + item.population, 0);
      setChartData(formattedData);
      setTotalSpent(total);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading spending data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load spending data');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading spending data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No spending data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Breakdown</Text>
      <Text style={styles.totalAmount}>
        Total Spent: ${totalSpent.toFixed(2)}
      </Text>
      <View style={styles.chartWrapper}>
        <PieChart
          data={chartData}
          width={screenWidth - 80}
          height={250}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="#ffffff"
          paddingLeft="80"
          absolute
          hasLegend={false}
        />
      </View>
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.name}: ${item.population.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b46c1',
    textAlign: 'center',
    marginBottom: 20,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 0,
    marginBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b46c1',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    margin: 10,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  legendContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});