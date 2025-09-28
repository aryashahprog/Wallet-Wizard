import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getAISavingsSuggestions } from '../../scripts/suggestion';

interface AISavingsSuggestionsProps {
  accountId: string;
}

export default function AISavingsSuggestions({ accountId }: AISavingsSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSuggestions();
  }, [accountId]);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!accountId) {
        throw new Error('Account ID is required');
      }

      const result = await getAISavingsSuggestions(accountId);

      if (!result) {
        throw new Error('No suggestions received');
      }

      setSuggestions(result);
    } catch (err) {
      console.error('Error fetching AI suggestions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
      // Fallback suggestions
      setSuggestions(`Personalized saving suggestions:
* Try meal prepping on Sundays to reduce takeout and restaurant spending during busy weekdays
* Look for free community events and use library resources for entertainment instead of paid subscriptions
* Consider carpooling or public transport for regular commutes 2-3 days per week
* Review recurring subscriptions and cancel unused services to free up monthly budget`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Analyzing your spending patterns...</Text>
        </View>
      </View>
    );
  }

  if (error && !suggestions) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </View>
    );
  }

  // Parse suggestions to extract bullet points
  const suggestionLines = suggestions?.split('\n').filter(line => line.startsWith('*')) || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI-Powered Savings Recommendations</Text>
      <Text style={styles.subtitle}>
        Based on your spending patterns, here are personalized ways to save:
      </Text>
      
      <View style={styles.suggestionsContainer}>
        {suggestionLines.map((line, index) => (
          <View key={index} style={styles.suggestionItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.suggestionText}>{line.slice(2)}</Text>
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
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b46c1',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  suggestionsContainer: {
    paddingTop: 0,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 16,
    color: '#8b5cf6',
    marginRight: 12,
    marginTop: 2,
    fontWeight: 'bold',
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    textAlign: 'center',
  },
});