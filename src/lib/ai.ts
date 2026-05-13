/**
 * lib/ai.ts
 * AI Utility for content translation and enhancement.
 * Using Google Gemini API.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
}

/**
 * Translates content between Indonesian and English using AI.
 */
export async function translateContent(
  text: string,
  targetLang: 'en' | 'id'
): Promise<TranslationResult> {
  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing. Returning original text as fallback.");
    return { translatedText: text };
  }

  const prompt = `Translate the following text to ${targetLang === 'en' ? 'English' : 'Indonesian'}. 
  Maintain the original tone, formatting (if HTML/Markdown), and meaning.
  
  Text:
  ${text}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || text;

    return {
      translatedText: translatedText.trim(),
    };
  } catch (error) {
    console.error("AI Translation failed:", error);
    return { translatedText: text };
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
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || text;
  } catch (error) {
    return text;
  }
}
