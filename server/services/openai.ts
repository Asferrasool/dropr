import OpenAI from "openai";

// Using OpenRouter API with DeepSeek models for free AI processing
const openai = new OpenAI({ 
  apiKey: process.env.OPENROUTER_API_KEY || "your-openrouter-api-key-here",
  baseURL: "https://openrouter.ai/api/v1",
});

export interface AIOrderResponse {
  intent: "order" | "inquiry" | "complaint" | "other";
  items?: Array<{
    name: string;
    quantity: number;
    category: "food" | "medicine" | "groceries";
    specifications?: string;
  }>;
  location?: string;
  message: string;
  requiresHumanHelp: boolean;
}

export async function processAIMessage(userMessage: string, userId: string): Promise<AIOrderResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for DeliverPak, a delivery service for rural Pakistani areas. You help users order food, medicines, and groceries.

Instructions:
- Respond in a friendly, helpful manner
- Support both English and Urdu (romanized)
- Understand local Pakistani food items, medicines, and grocery needs
- Parse user requests for ordering items
- Always respond in JSON format with the structure provided
- If user wants to order something, extract items with quantities
- For unclear requests, ask for clarification
- For complex medical needs, suggest consulting a doctor
- Be culturally sensitive and appropriate for Pakistani rural context

Categories:
- food: biryani, karahi, roti, naan, curry, rice, dal, etc.
- medicine: panadol, disprin, cough syrup, bandages, etc.  
- groceries: rice, flour, oil, spices, vegetables, milk, etc.

Respond with JSON in this exact format:
{
  "intent": "order|inquiry|complaint|other",
  "items": [{"name": "item name", "quantity": number, "category": "food|medicine|groceries", "specifications": "optional details"}],
  "location": "if mentioned",
  "message": "your response message",
  "requiresHumanHelp": boolean
}`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      intent: result.intent || "other",
      items: result.items || [],
      location: result.location,
      message: result.message || "I'm here to help you order food, medicines, or groceries. What would you like today?",
      requiresHumanHelp: result.requiresHumanHelp || false
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      intent: "other",
      message: "I'm sorry, I'm having trouble understanding right now. Please try again or contact our support team.",
      requiresHumanHelp: true
    };
  }
}

export async function generateOrderSummary(items: any[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system",
          content: "Create a friendly order summary in both English and Urdu (romanized) for a Pakistani delivery service. Be concise and helpful."
        },
        {
          role: "user",
          content: `Create an order summary for these items: ${JSON.stringify(items)}`
        }
      ],
    });

    return response.choices[0].message.content || "Order summary ready for confirmation.";
  } catch (error) {
    console.error("Error generating order summary:", error);
    return "Your order is ready for confirmation.";
  }
}
