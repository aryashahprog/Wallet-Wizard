import OpenAI from 'openai';

const API_KEY = "burger";
const BASE_URL = 'http://api.nessieisreal.com';

const openai = new OpenAI({
    apiKey: "cheeseburger",
});

export async function getAISavingsSuggestions(accountId: string) {
    console.log('Starting getAISavingsSuggestions function');
    console.log('Input accountId:', accountId);
    
    try {
        // First, get the spending data
        const response = await fetch(`${BASE_URL}/accounts/${accountId}/purchases?key=${API_KEY}`);
        const purchaseData = await response.json();
        
        // Generate AI-powered savings suggestions
        const GPTresponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system' as const,
                    content: `You are a financial advisor AI that analyzes spending data and provides practical cost-cutting suggestions.

                    TASK: Analyze purchase transaction data from the past 7 days and generate personalized, specific savings recommendations.

                    RESPONSE FORMAT:
                    Return exactly in this format:
                    Personalized saving suggestions:
                    * [First specific, actionable suggestion]
                    * [Second specific, actionable suggestion] 
                    * [Third specific, actionable suggestion]
                    * [Fourth specific, actionable suggestion (optional)]

                    GUIDELINES:
                    - Focus on the highest spending categories from the data
                    - Make suggestions specific and actionable
                    - Keep each bullet point to 1-2 sentences
                    - Focus on behavior changes and substitutions, not restrictions
                    - Make suggestions feel achievable and positive
                    - Analyze actual spending patterns to personalize advice

                    RULES:
                    - Use exactly the format shown above
                    - Include 3-4 bullet points
                    - No additional text, explanations, or formatting
                    - Start each bullet with asterisk and space`
                },
                {
                    role: 'user' as const,
                    content: `Analyze this spending data and provide personalized savings suggestions: ${JSON.stringify(purchaseData)}`
                }
            ],
        });

        const suggestions: string = GPTresponse.choices[0].message.content!;
        
        console.log('Generated AI suggestions:', suggestions);
        return suggestions;

    } catch (error) {
        console.error("Error generating AI savings suggestions:", error);
    }
}