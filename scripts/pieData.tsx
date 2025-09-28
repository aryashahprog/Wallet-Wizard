import OpenAI from 'openai';

const API_KEY = "burger";
const BASE_URL = 'http://api.nessieisreal.com';

const openai = new OpenAI({
    apiKey: "cheeseburger",
})

export async function getSpendingData( accountId: string ) {
    console.log('🚀 Starting getSpendingData function');
    console.log('📋 Input customerId:', accountId);
    try {
        const response = await fetch(`${BASE_URL}/accounts/${accountId}/purchases?key=${API_KEY}`);
        const data = await response.json();
        const GPTresponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system' as const,
                    content: `You are a JSON-only API for categorizing purchase transactions. 

                    TASK: Analyze purchase data and return category totals as JSON.

                    CATEGORIES (use exactly as shown):
                    - Food: Groceries, restaurants, cafes, food delivery, snacks, beverages
                    - Leisure: Entertainment, hobbies, games, movies, books, subscriptions, sports, travel
                    - Transportation: Gas, public transit, rideshare, parking, car maintenance, flights, hotels
                    - Necessities: Utilities, rent, insurance, healthcare, clothing, household items, phone bills
                    - Other: Everything else not clearly fitting above categories

                    RESPONSE FORMAT:
                    Return only a JSON object with this exact structure:
                    {
                    "Food": 0.00,
                    "Leisure": 0.00, 
                    "Transportation": 0.00,
                    "Necessities": 0.00,
                    "Other": 0.00
                    }

                    RULES:
                    - Numbers must be rounded to 2 decimal places
                    - Include all 5 categories even if total is 0.00
                    - No markdown, code blocks, or additional text
                    - Raw JSON only`
                },
                {
                    role: 'user' as const,
                    content: `${JSON.stringify(data)}`
                }
            ],
        });


        const categories: Record<string, number> = JSON.parse(GPTresponse.choices[0].message.content!);

        console.log(categories);
    return categories;

    } catch (error) {
        console.error("Error fetching spending data:", error);
    }
}