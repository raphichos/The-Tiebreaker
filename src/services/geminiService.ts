import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type AnalysisType = 'pros-cons' | 'comparison' | 'swot';

export async function analyzeDecision(decision: string, type: AnalysisType) {
  const model = "gemini-3-flash-preview";
  
  let prompt = "";
  if (type === 'pros-cons') {
    prompt = `Analyze the following decision and provide a detailed list of pros and cons: "${decision}". Format the output clearly with headings and bullet points.`;
  } else if (type === 'comparison') {
    prompt = `Analyze the following decision/options and provide a comparison table: "${decision}". Include key criteria for comparison and a final recommendation. Use Markdown table format.`;
  } else if (type === 'swot') {
    prompt = `Perform a SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for the following decision: "${decision}". Format the output with clear sections for each SWOT quadrant.`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate analysis. Please try again.");
  }
}
