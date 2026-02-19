
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const cleanTamilText = async (rawText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The following is raw text extracted from a Tamil PDF. Please clean it up by:
      1. Removing page numbers, headers, and footers.
      2. Fixing broken words or sentences caused by line breaks.
      3. Preserving the Tamil language and structure.
      4. Returning only the cleaned text.
      
      Raw Text:
      ${rawText.substring(0, 10000)}`, // Limiting for safety
      config: {
        temperature: 0.1,
        topP: 0.95,
      },
    });

    return response.text || rawText;
  } catch (error) {
    console.error("Gemini Error:", error);
    return rawText; // Fallback to raw text if AI fails
  }
};
