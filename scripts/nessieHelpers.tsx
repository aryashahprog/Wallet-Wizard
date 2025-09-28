import OpenAI from 'openai';

const API_KEY = "burger";
const BASE_URL = 'http://api.nessieisreal.com';

const openai = new OpenAI({
    apiKey: "cheeseburger";
});

const MASTER_ACCOUNT_ID = "68d8c7f69683f20dd51985c6";


export async function generatePurchaseHistory(): Promise<string> {
    try {
        const customerId = await createNessieCustomer();
        const accountId = await createNessieAccount( customerId );
        await generatePurchases( accountId );
        return accountId;
    } catch (error) {
        console.error("Error creating Nessie account:", error);
        throw error;
    }
}

async function createNessieCustomer() {
    const messages = [
        {
            role: 'system' as const,
            content: 'You are a JSON-only API. You respond with raw JSON data only. Never use markdown formatting or code blocks.',
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
                Return ONLY a JSON object matching this schema:
                {
                  "type": "Checking",
                  "nickname": "string", 
                  "rewards": 0,
                  "balance": 0,
                }
                DO NOT surround the text with any other characters.`,
        }
    ];

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
    });

    const accountData = JSON.parse(response.choices[0].message.content!);
    console.log(accountData);

    const apiResponse = await fetch(`${BASE_URL}/customers/${customerId}/accounts?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
    });
    const result = await apiResponse.json();
    console.log(result);
    return result.objectCreated._id;
}

async function generatePurchases( accountId: number ) {
    console.log(accountId);
    const messages = [
        {
            role: 'system' as const,
            content: 'You are a JSON-only API. You respond with raw JSON data only. Never use markdown formatting or code blocks.',
        },
        {
            role: 'user' as const, 
            content: `Generate 30 realistic purchases for a checking account over the last 14 days:
                Think of various merchants like "Starbucks", "Target", "Shell Gas", "McDonald's", "Amazon", etc.
                - merchant_id should ALWAYS be ${MASTER_ACCOUNT_ID}
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
    console.log(response.choices[0].message.content);
    const purchaseHistory = JSON.parse(response.choices[0].message.content!);
    
    for (const purchase of purchaseHistory) {
        const apiResponse = await fetch(`${BASE_URL}/accounts/${accountId}/purchases?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(purchase)
        });
        const result = await apiResponse.json();
        console.log(result);
    }
}