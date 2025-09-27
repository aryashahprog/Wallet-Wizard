import OpenAI from 'openai';

const API_KEY = "hamburger";
const BASE_URL = 'http://api.nessieisreal.com';

const openai = new OpenAI({
    apiKey: "cheeseburger",
})


export async function generatePurchaseHistory(): Promise<void> {
    try {
        const customerId = await createNessieCustomer();
        await createNessieAccount( customerId );
        await generatePurchases( customerId );
    } catch (error) {
        console.error("Error creating Nessie account:", error);
        throw error;
    }
}

async function createNessieCustomer() {
    const messages = [
        {
            role: 'system' as const,
            content: 'You are a helpful assistant that generates realistic user data for banking.',
        },
        {
            role: 'user' as const, 
            content: `Generate a realistic customer profile for banking with these requirements:
                - Include first_name, last_name 
                - Include complete address with street_number, street_name, city, state, zip
                - Make it feel like a real person
                - Use realistic US address data
                Return ONLY a JSON object, no other text, matching this schema:
                {
                  "first_name": "string",
                  "last_name": "string",
                  "address": {
                    "street_number": "string",
                    "street_name": "string",
                    "city": "string",
                    "state": "string",
                    "zip": "string"
                  }
                }
                DO NOT surround the text with any other characters.`,
        }
    ];

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
    });

    const customerData = JSON.parse(response.choices[0].message.content!);
    
    const apiResponse = await fetch(`${BASE_URL}/customers?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
    });

    const result = await apiResponse.json();
    return result.objectCreated._id;
}

async function createNessieAccount( customerId: number ) {
    const messages = [
        {
            role: 'system' as const,
            content: 'You are a JSON-only API. You respond with raw JSON data only. Never use markdown formatting or code blocks.',
        },
        {
            role: 'user' as const, 
            content: `Generate a realistic bank account with these requirements:
                - type should be "Checking" or "Savings" or "Credit Card" 
                - nickname should be something realistic like "Main Checking" or "Primary Account"
                - rewards should be a reasonable number (0-1000)
                - balance should be realistic for a young adult ($500-$5000)
                - account_number should be a realistic 10-12 digit account number
                Return ONLY a JSON object matching this schema:
                {
                  "type": "Checking",
                  "nickname": "string", 
                  "rewards": 0,
                  "balance": 0,
                  "account_number": "string"
                }
                DO NOT surround the text with any other characters.`,
        }
    ];

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
    });

    console.log('🤖 ChatGPT Customer Response:');
    console.log(response.choices[0].message.content);
    console.log('=====================================');

    const accountData = JSON.parse(response.choices[0].message.content!);
    
    await fetch(`${BASE_URL}/customers/${customerId}/accounts?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
    });
}

async function generatePurchases( customerId: number ) {
    const messages = [
        {
            role: 'system' as const,
            content: 'You are a JSON-only API. You respond with raw JSON data only. Never use markdown formatting or code blocks.',
        },
        {
            role: 'user' as const, 
            content: `Generate 30 realistic purchases for a checking account over the last 3 months:
                - Include various merchants like "Starbucks", "Target", "Shell Gas", "McDonald's", "Amazon", etc.
                - Amounts should vary from $5 to $200
                - Dates should be spread over last 61 days in ISO format (YYYY-MM-DD)
                - Include realistic 1-sentence descriptions
                - Set status to "pending" for all purchases
                - Set medium to "balance" for all purchases
                Return ONLY a JSON array of purchase objects matching this exact schema:
                {
                  "merchant_id": "string",
                  "medium": "balance", 
                  "purchase_date": "2025-09-27",
                  "amount": 0,
                  "status": "pending",
                  "description": "string"
                }
                No other text, just the JSON array`
        }
    ];

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
    });

    const purchaseHistory = JSON.parse(response.choices[0].message.content!);
    
    for (const purchase of purchaseHistory) {
        await fetch(`${BASE_URL}/accounts/${customerId}/purchases?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(purchase)
        });
        console.log(purchase);
    }
}