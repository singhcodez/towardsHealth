// netlify/functions/analyze.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
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

    // --- FALLBACK CHAIN SETUP ---
    const commonConfig = {
      apiKey: apiKey,
      temperature: 0.0,
      maxRetries: 0, // Force instant failover on rate limits (429 errors)
    };

    // 1. Primary: The latest, most capable free model
    const model1 = new ChatGoogleGenerativeAI({
      modelName: "gemini-3.5-flash", 
      ...commonConfig
    });

    // 2. Secondary: Ultra-fast 3.1 model
    const model2 = new ChatGoogleGenerativeAI({
      modelName: "gemini-3.1-flash-lite", 
      ...commonConfig
    });

    // 3. Tertiary: Highly stable previous generation
    const model3 = new ChatGoogleGenerativeAI({
      modelName: "gemini-2.5-flash", 
      ...commonConfig
    });

    // 4. Quaternary: Older lightweight model
    const model4 = new ChatGoogleGenerativeAI({
      modelName: "gemini-2.5-flash-lite", 
      ...commonConfig
    });

    // 5. Final Fallback: Gemma (Open-weights model hosted on Google AI Studio)
    const model5 = new ChatGoogleGenerativeAI({
      modelName: "gemma-4-26b-a4b", // Supported Gemma model on Google AI
      apiKey: apiKey,
      temperature: 0.0,
      maxRetries: 1, // Allow one retry on the absolute final model before completely failing
    });

    // Link them all together. If model1 fails, it tries model2, then model3, etc.
    const robustModel = model1.withFallbacks([model2, model3, model4, model5]);
    // ----------------------------

 // 1. DEFINE YOUR EXACT JSON STRUCTURE
    const fitnessSchema = z.object({
  daily_verdict: z.string().describe("A short, encouraging or analytical sentence summarizing the day based on calories and weather."),
  total_calories_in: z.number().describe("Total calories consumed from all meals."),
  total_calories_out: z.number().describe("Total calories burned from all activities."),
  macros: z.object({
    protein_g: z.number().describe("Total protein in grams"),
    carbs_g: z.number().describe("Total carbs in grams"),
    fat_g: z.number().describe("Total fat in grams")
  }).describe("Macronutrient breakdown of the meals consumed")
});


    // 2. CREATE THE STRUCTURED PARSER
    const parser = StructuredOutputParser.fromZodSchema(fitnessSchema);
  
    
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
        2. Do NOT wrap the JSON in markdown code blocks.
        3. Do NOT include ANY conversational text before or after the JSON.
        4. Be completely deterministic. Always apply the exact same standard nutritional values (e.g., USDA database) to identical food items across different requests.

        {format_instructions}
      `,
      inputVariables: ["profession", "weather", "meals", "activities"],
      partialVariables: { format_instructions: parser.getFormatInstructions() },
    });

    // Execute the pipeline
    const chain = prompt.pipe(robustModel).pipe(parser);

    const result = await chain.invoke({
      profession: payload.profession,
      weather: JSON.stringify(payload.weather),
      meals: JSON.stringify(payload.meals),
      activities: JSON.stringify(payload.activities),
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    };

  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: `Processing failed across all fallback models: ${err.message}` }) 
    };
  }
};
