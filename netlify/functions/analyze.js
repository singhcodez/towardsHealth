// netlify/functions/analyze.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "API key is missing from environment" }) };
    }

    // 1. Initialize the LangChain Gemini Model
    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-3.1-flash-lite",
      apiKey: apiKey,
      temperature: 0.0, // Low temperature for more consistent data parsing
    });

    // 2. Define the exact JSON structure you want LangChain to enforce
    const parser = new JsonOutputParser();
    const formatInstructions = parser.getFormatInstructions();

    // 3. Create a clean Prompt Template
    // 3. Create a clean, strict Prompt Template
    const prompt = new PromptTemplate({
      template: `
        You are a strict, automated fitness data API. You do not converse. You only output raw, valid JSON.
        
        User Profession: {profession}
        Local Weather: {weather}
        
        Meals Consumed: {meals}
        
        Activities & Exercise Done: {activities}
        
        Calculate total calories in, total calories out, macronutrients, and provide a short daily_verdict based on the net balance and weather.
        
        CRITICAL RULES:
        1. Output ONLY a valid JSON object.
        2. Do NOT wrap the JSON in markdown code blocks (e.g., do not use \`\`\`json).
        3. Do NOT include ANY conversational text before or after the JSON.
        4. Be completely deterministic. Always apply the exact same standard nutritional values (e.g., USDA database) to identical food items across different requests.

        {format_instructions}
      `,
      inputVariables: ["profession", "weather", "meals", "activities"],
      partialVariables: { format_instructions: formatInstructions },
    });

    // 4. Create the LangChain Chain (Prompt -> Model -> Parser)
    const chain = prompt.pipe(model).pipe(parser);

    // 5. Execute the chain with the user's payload
    const result = await chain.invoke({
      profession: payload.profession,
      weather: JSON.stringify(payload.weather),
      meals: JSON.stringify(payload.meals),
      activities: JSON.stringify(payload.activities),
    });

    // 6. Return the perfectly parsed JSON back to React
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    };

  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: `Failed to process data via LangChain ${err}`, details: err.message }) 
    };
  }
};