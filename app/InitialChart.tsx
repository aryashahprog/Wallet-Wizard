import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AISavingsSuggestions from '../components/ui/AISuggestion';
import PieChartComponent from '../components/ui/PieChart';

interface PieChartScreenProps {
  user: {
    username: string;
    password: string;
    accountId?: string;
  };
  onContinue: () => void;
}

const SAVINGS_CATEGORIES = [
  { id: 'necessities', label: 'Necessities' },
  { id: 'transportation', label: 'Transportation' },
  { id: 'food', label: 'Food' },
  { id: 'leisure', label: 'Leisure' },
  { id: 'other', label: 'Other' },
];

export default function PieChartScreen({ user, onContinue }: PieChartScreenProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    // You can pass selectedCategories to onContinue if needed
    // onContinue(selectedCategories);
    onContinue();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>
          <Text style={styles.subtitle}>This week&apos;s spending overview:</Text>
        </View>

        {user.accountId ? (
          <>
            <View style={styles.chartSection}>
              <PieChartComponent accountId={user.accountId} />
            </View>
            
            <View style={styles.aiSuggestionsSection}>
              <AISavingsSuggestions accountId={user.accountId} />
            </View>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Unable to load spending data. Customer ID not found.
            </Text>
          </View>
        )}

        <View style={styles.savingsSection}>
          <Text style={styles.savingsTitle}>What areas do you want to lower costs?</Text>
          <Text style={styles.savingsSubtitle}>Select all categories that apply:</Text>
          
          <View style={styles.categoriesContainer}>
            {SAVINGS_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryOption,
                  selectedCategories.includes(category.id) && styles.categoryOptionSelected
                ]}
                onPress={() => toggleCategory(category.id)}
              >
                <View style={[
                  styles.checkbox,
                  selectedCategories.includes(category.id) && styles.checkboxSelected
                ]}>
                  {selectedCategories.includes(category.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={[
                  styles.categoryText,
                  selectedCategories.includes(category.id) && styles.categoryTextSelected
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              selectedCategories.length === 0 && styles.continueButtonDisabled
            ]} 
            onPress={handleContinue}
            disabled={selectedCategories.length === 0}
          >
            <Text style={[
              styles.continueButtonText,
              selectedCategories.length === 0 && styles.continueButtonTextDisabled
            ]}>
              Start Saving!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f0ff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 40,
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
  },
  chartSection: {
    marginBottom: 30,
  },
  aiSuggestionsSection: {
    marginBottom: 30,
  },
  errorContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    margin: 10,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  savingsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    margin: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  savingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 8,
  },
  savingsSubtitle: {
    fontSize: 16,
    color: '#6b46c1',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  categoryOptionSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#f3f0ff',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#8b5cf6',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  categoryTextSelected: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  continueButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowColor: '#d1d5db',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  continueButtonTextDisabled: {
    color: '#9ca3af',
  },
});