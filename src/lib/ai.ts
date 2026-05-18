/**
 * lib/ai.ts
 * AI Utility for content translation and enhancement using Google Gemini.
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
  targetLang: "en" | "id"
): Promise<TranslationResult> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    console.warn("GEMINI_API_KEY is missing or invalid. Returning original text.");
    return { translatedText: text, success: false, error: "Missing API Key" };
  }

  const targetLabel = targetLang === "en" ? "English" : "Indonesian";
  const sourceLabel = targetLang === "en" ? "Indonesian" : "English";

  const prompt = `You are a professional translator for a school management system.
Translate the following text from ${sourceLabel} to ${targetLabel}.

RULES:
1. ONLY return the translated text.
2. Do NOT include any explanations, quotes, or metadata.
3. Maintain a professional and educational tone.
4. If the text is code, a date, or a number, return it unchanged.

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
          temperature: 0.1,
          topK: 1,
          topP: 1,
        },
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
      success: true,
    };
  } catch (error) {
    console.error("AI Translation failed:", (error as Error).message);
    return { translatedText: text, success: false, error: (error as Error).message };
  }
}

/**
 * Enhances/Summarizes content using AI.
 */
export async function enhanceContent(text: string): Promise<string> {
  if (!GEMINI_API_KEY) return text;

  const prompt = `Perbaiki dan buat teks berikut menjadi lebih profesional, menarik, dan sesuai untuk komunitas sekolah (guru, staf, orang tua, dan siswa).
Harap berikan respons menggunakan Bahasa Indonesia yang baik dan benar.

Teks:
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
  } catch {
    // Return original text on any failure
    return text;
  }
}

/**
 * AI Assistant for Teachers and Staff.
 */
export async function askAssistant(prompt: string, context: string = ""): Promise<string> {
  if (!GEMINI_API_KEY) return "AI Assistant tidak tersedia karena API key belum diatur.";

  const fullPrompt = `Anda adalah Asisten Cerdas untuk sistem manajemen sekolah (VisiSekolah). Tugas Anda adalah membantu guru dan staf administrasi dengan pertanyaan atau tugas operasional sekolah.
Harap berikan respons menggunakan Bahasa Indonesia yang profesional, jelas, dan solutif.

Konteks Sistem/Data (Jika ada):
${context}

Pertanyaan/Tugas:
${prompt}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
  } catch {
    return "Terjadi kesalahan saat menghubungi layanan AI Assistant.";
  }
}

/**
 * Generate Report Phrasing using AI.
 */
export async function generateReport(data: any, reportType: string): Promise<string> {
  if (!GEMINI_API_KEY) return "AI Generator tidak tersedia karena API key belum diatur.";

  const prompt = `Anda adalah Asisten Cerdas di sistem sekolah yang bertugas menyusun laporan atau redaksi tulisan secara otomatis berdasarkan data mentah.
Harap berikan respons menggunakan Bahasa Indonesia yang formal, terstruktur, dan cocok untuk pelaporan resmi.

Jenis Laporan: ${reportType}

Data:
${JSON.stringify(data, null, 2)}

Susunlah redaksi laporan yang mudah dipahami dan profesional berdasarkan data di atas.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const dataResp = await response.json();
    return dataResp.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal menghasilkan laporan.";
  } catch {
    return "Terjadi kesalahan saat menghasilkan laporan.";
  }
}
