import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "cheeseburger",
});

interface AIChallenge {
  name: string;
  emoji: string;
  description: string;
  estimatedSavings: number;
  points: number;
  difficulty: string;
  category: string;
}

/**
 * Generate personalized challenges based on user's selected focus areas
 * @param selectedCategories - Array of categories user wants to save money on
 * @param challengeCount - Number of challenges to generate (default: 5)
 * @returns Array of AI-generated challenges
 */
export async function generatePersonalizedChallenges(
  selectedCategories: string[],
  challengeCount: number = 6
) {
  console.log('🤖 Generating personalized challenges for categories:', selectedCategories);
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system' as const,
          content: `You are a financial wellness AI that creates personalized money-saving challenges.

          TASK: Generate ${challengeCount} realistic, actionable money-saving challenges based on the user's focus areas.

          CATEGORIES AND THEIR MEANINGS:
          - food: Dining out, groceries, coffee, snacks, meal delivery
          - transportation: Gas, rideshare, parking, public transit, car expenses
          - leisure: Entertainment, hobbies, subscriptions, games, movies, sports
          - necessities: Utilities, household items, clothing, personal care, phone bills
          - other: Miscellaneous expenses, impulse purchases, shopping

          CHALLENGE REQUIREMENTS:
          - Be specific and actionable (not vague like "spend less")
          - Include realistic savings estimates based on typical spending
          - Assign appropriate difficulty levels: Easy (minimal effort), Medium (some planning), Hard (significant change)
          - Points should reflect difficulty and potential savings (Easy: 10-25, Medium: 25-40, Hard: 40-60)
          - Choose relevant emojis that represent the challenge action
          - Be creative, do NOT recommend bringing packed lunch from home.

          RESPONSE FORMAT:
          Return only a JSON array with this exact structure (not necessarily exact number):
          [
            {
              "name": "Specific Challenge Name",
              "emoji": "📱",
              "description": "Clear, motivating description of what to do",
              "estimatedSavings": 15,
              "points": 20,
              "difficulty": *Easy, Medium, or Hard*,
              "category": *must be one of the specified categories (food, transportation, leisure, necessities, other)*
            }
          ]

          RULES:
          - Generate challenges ONLY for the specified categories
          - If no categories specified, create a balanced mix across all categories
          - Each challenge must be unique and actionable
          - Savings should be realistic daily amounts (not weekly/monthly)
          - No markdown, code blocks, or additional text - raw JSON only
          - Ensure all required fields are present and properly formatted`
        },
        {
          role: 'user' as const,
          content: selectedCategories.length > 0 
            ? `Generate ${challengeCount} money-saving challenges focused on these categories: ${selectedCategories.join(', ')}`
            : `Generate ${challengeCount} diverse money-saving challenges across all categories`
        }
      ],
      temperature: 0.7, // Add some creativity while maintaining consistency
    });

    const challengesData = JSON.parse(response.choices[0].message.content!);
    

    console.log(`✅ Generated ${challengesData.length} personalized challenges`);
    return challengesData;

  } catch (error) {
    console.error('Error generating AI challenges:', error);
  }
}

/**
 * Get a single random AI-generated challenge for daily spin
 * @param selectedCategories - User's focus areas
 * @returns Single challenge for today
 */
export async function getTodaysAIChallenge(selectedCategories: string[]): Promise<AIChallenge> {
  const challenges = await generatePersonalizedChallenges(selectedCategories, 1);
  return challenges![0];
}