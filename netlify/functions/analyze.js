
export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "API key is missing" }) };
    }

    // Construct the structured prompt for Gemini
    const prompt = `
      You are an elite fitness and nutrition AI. Analyze this structured fitness data log for today.
      
      User Profile & Context:
      - Profession: ${payload.profession}
      - Local Weather: ${JSON.stringify(payload.weather)}

      Meals Consumed:
      ${JSON.stringify(payload.meals)}

      Activities & Exercise Done:
      ${JSON.stringify(payload.activities)}

      Instructions:
      1. Calculate total_calories_in based on standard profiles or specific brands provided.
      2. Calculate total_calories_out (combine standard BMR calculations with the burned calories from exercises/tasks/profession).
      3. Provide macro breakdown (protein_g, carbs_g, fat_g).
      4. Give a short 'daily_verdict' advising what to eat or how to work out next based on their net balance and local weather.

      Return ONLY a valid JSON object matching this exact schema:
      {
        "total_calories_in": number,
        "total_calories_out": number,
        "macros": {
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number
        },
        "daily_verdict": "string"
      }
    `;

    // Make the request to Gemini 2.5 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          response_mime_type: "application/json" // Enforce strict JSON output
        }
      })   
    });
      // 1. Check if the API hit a rate limit (429) or is unauthorized (401/403)
    if (response.status === 429) {
     return { statusCode: 429, body: JSON.stringify({ error: "Rate limit exceeded. Please try again in a minute." }) };
    }

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: "Gemini API error. Please check your API Key configuration." }) };
      }
    const data = await response.json();
    
    // Extract the JSON text from Gemini's response
    const finalResult = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: finalResult
    };

  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Failed to process data", details: err.message }) 
    };
  }
};
