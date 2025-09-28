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
  onContinue: (selectedCategories: string[]) => void;
}

const SAVINGS_CATEGORIES = [
  { id: 'necessities', label: 'Necessities' },
  { id: 'transportation', label: 'Transportation' },
  { id: 'food', label: 'Food' },
  { id: 'leisure', label: 'Leisure' },
  { id: 'other', label: 'Other' },
];

// Mock AI suggestions - in real app, this would come from your AI service
const AI_SUGGESTED_CATEGORIES = ['food', 'transportation']; // These will have purple borders

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
    // Pass the selected categories to the parent component
    onContinue(selectedCategories);
  };

  const isAISuggested = (categoryId: string) => {
    return AI_SUGGESTED_CATEGORIES.includes(categoryId);
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
          <Text style={styles.savingsTitle}>What would you like to save money on?</Text>
          <Text style={styles.savingsSubtitle}>Select all categories that apply:</Text>
          
          {/* AI Suggestions Header */}
          <View style={styles.aiSuggestionsHeader}>
            <Text style={styles.aiSuggestionsText}>
              ✨ Categories with purple borders are AI-recommended for you
            </Text>
          </View>
          
          <View style={styles.categoriesContainer}>
            {SAVINGS_CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              const isAIRecommended = isAISuggested(category.id);
              
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    isSelected && styles.categoryOptionSelected,
                    isAIRecommended && styles.categoryOptionAISuggested,
                    isSelected && isAIRecommended && styles.categoryOptionSelectedAI
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <View style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected
                  ]}>
                    {isSelected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected
                  ]}>
                    {category.label}
                  </Text>
                  {isAIRecommended && (
                    <View style={styles.aiRecommendedBadge}>
                      <Text style={styles.aiRecommendedText}>AI</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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
    marginBottom: 16,
  },
  aiSuggestionsHeader: {
    backgroundColor: '#f3f0ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  aiSuggestionsText: {
    fontSize: 14,
    color: '#6b46c1',
    textAlign: 'center',
    fontStyle: 'italic',
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
  categoryOptionAISuggested: {
    borderColor: '#a855f7',
    backgroundColor: '#faf5ff',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryOptionSelectedAI: {
    borderColor: '#7c3aed',
    backgroundColor: '#ede9fe',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
  aiRecommendedBadge: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  aiRecommendedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectionSummary: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  selectionSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  selectionSummaryText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
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