/**
 * lib/ai.ts
 * AI Utility for content translation and enhancement.
 * Using Google Gemini API.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

export interface TranslationResult {
  translatedText: string;
  success: boolean;
  error?: string;
}

/**
 * Translates content between Indonesian and English using AI.
 */
export async function translateContent(
  text: string,
  targetLang: 'en' | 'id'
): Promise<TranslationResult> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn("GEMINI_API_KEY is missing or invalid. Returning original text.");
    return { translatedText: text, success: false, error: 'Missing API Key' };
  }

  const targetLabel = targetLang === 'en' ? 'English' : 'Indonesian';
  const sourceLabel = targetLang === 'en' ? 'Indonesian' : 'English';

  const prompt = `You are a professional translator for a school management system. 
  Translate the following text from ${sourceLabel} to ${targetLabel}. 
  
  RULES:
  1. ONLY return the translated text. 
  2. Do NOT include any explanations, quotes, or metadata.
  3. Maintain the professional and educational tone.
  4. If the text is a technical code, date, or number, return it exactly as is.
  
  Text to translate:
  ${text}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent translation
          topK: 1,
          topP: 1,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!translatedText) {
      throw new Error("Empty response from AI");
    }

    return {
      translatedText: translatedText.trim(),
      success: true
    };
  } catch (error: any) {
    console.error("AI Translation failed:", error.message);
    return { translatedText: text, success: false, error: error.message };
  }
}

/**
 * Enhances/Summarizes content using AI.
 */
export async function enhanceContent(text: string): Promise<string> {
  if (!GEMINI_API_KEY) return text;

  const prompt = `Enhance the following text to make it more professional and engaging for a school community.
  
  Text:
  ${text}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || text;
  } catch (error) {
    return text;
  }
}
