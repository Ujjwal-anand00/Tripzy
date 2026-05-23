import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

// ✅ Init
const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

// -------------------------------
// 🤖 CHAT
// -------------------------------
export const generateAssistantReply = async (messages) => {
  try {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // ✅ FREE + WORKING
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new AppError("Empty AI response", 502);
    }

    return text;
  } catch (error) {
    console.log("❌ Gemini Chat Error:", error);
    throw new AppError(error.message, 500);
  }
};

// -------------------------------
// 🗺️ ITINERARY
// -------------------------------
export const generateStructuredItinerary = async ({
  destination,
  budget,
  duration,
  preferences,
}) => {
  const preferenceText =
    preferences?.length > 0
      ? preferences.join(", ")
      : "flexible sightseeing";

  try {
    const prompt = `
Create a ${duration}-day trip plan for ${destination}.

Budget: ${budget}
Preferences: ${preferenceText}

Return ONLY valid JSON. No explanation.

{
  "overview": "string",
  "days": [
    {
      "day": number,
      "title": "string",
      "summary": "string",
      "activities": [
        {
          "time": "string",
          "title": "string",
          "description": "string",
          "location": "string",
          "estimatedCost": number
        }
      ]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // ✅ FREE MODEL
      contents: prompt,
    });

    let text = response.text;

    console.log("🧠 RAW RESPONSE:", text);

    if (!text) {
      throw new AppError("Empty itinerary response", 502);
    }

    // Clean JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      console.log("❌ JSON ERROR:", text);
      throw new AppError("Invalid AI response format", 500);
    }
  } catch (error) {
    console.log("❌ Gemini Error:", error);
    throw new AppError(error.message, 500);
  }
};