
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFinancialInsights(txDetails: any) {
  try {
    const prompt = `Analyze this payment request for Remitrax:
    Amount: ${txDetails.amount} ${txDetails.currency}
    Recipient: ${txDetails.recipientName}
    Rail: ${txDetails.rail}
    
    Provide 2-3 short, futuristic financial insights or safety tips. 
    Format your response as a JSON array of strings.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return ["AI module currently recalibrating.", "Always verify DLT hashes manually for high-value transfers."];
  }
}
