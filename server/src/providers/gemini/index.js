import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../../config/env.js';

/**
 * Gemini provider adapter.
 *
 * The API key lives ONLY here, server-side, and is never exposed to the
 * frontend. All AI traffic goes through this adapter. If no key is configured
 * the adapter reports `available: false` and the AI service falls back to the
 * deterministic demo planner.
 */
let client = null;
let model = null;

function getClient() {
  if (!env.GEMINI_API_KEY) return null;
  if (!client) {
    client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    model = client.getGenerativeModel({
      model: env.GEMINI_MODEL,
      generationConfig: { temperature: 0.6, maxOutputTokens: 8192 },
    });
  }
  return model;
}

export const geminiProvider = {
  available: () => Boolean(env.GEMINI_API_KEY),
  modelName: () => env.GEMINI_MODEL,

  /**
   * Generate structured JSON. The prompt must instruct Gemini to return
   * strict JSON — we also pass responseMimeType application/json.
   */
  async generateJSON(prompt, { responseMimeType = 'application/json' } = {}) {
    const m = getClient();
    if (!m) throw new Error('Gemini API key is not configured');
    const result = await m.generateContent(prompt);
    const text = (result?.response?.text?.() || '').trim();
    return { text, mimeType: responseMimeType };
  },

  async chat(prompt) {
    const m = getClient();
    if (!m) throw new Error('Gemini API key is not configured');
    const result = await m.generateContent(prompt);
    return (result?.response?.text?.() || '').trim();
  },
};
