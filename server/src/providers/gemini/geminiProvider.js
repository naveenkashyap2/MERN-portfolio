const { env } = require('../../config/env');
const { logger } = require('../../config/logger');
const { AI_LIMITS } = require('../../constants');

function status() {
  return {
    name: 'gemini',
    connected: Boolean(env.geminiKey),
    model: env.geminiKey ? env.geminiModel : null,
  };
}

function extractJson(text) {
  if (!text) throw new Error('Empty model response');
  const trimmed = String(text).trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fence ? fence[1] : trimmed;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object in model response');
  return JSON.parse(raw.slice(start, end + 1));
}

async function generateJson({ system, user, requestId }) {
  if (!env.geminiKey) {
    return { ok: false, reason: 'gemini_unconfigured', data: null, usage: {} };
  }
  if (user.length > AI_LIMITS.maxPromptChars) {
    return { ok: false, reason: 'prompt_too_large', data: null, usage: {} };
  }

  const started = Date.now();
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(env.geminiKey);
    const model = genAI.getGenerativeModel({
      model: env.geminiModel,
      systemInstruction: system,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    });
    const result = await model.generateContent(user);
    const text = result.response.text();
    if (text.length > AI_LIMITS.maxResponseChars) {
      return { ok: false, reason: 'response_too_large', data: null, usage: {} };
    }
    const data = extractJson(text);
    const usageMeta = result.response.usageMetadata || {};
    return {
      ok: true,
      data,
      usage: {
        model: env.geminiModel,
        inputTokens: usageMeta.promptTokenCount || 0,
        outputTokens: usageMeta.candidatesTokenCount || 0,
        latencyMs: Date.now() - started,
      },
    };
  } catch (err) {
    logger.warn('Gemini request failed', { requestId, reason: 'provider_error' });
    return {
      ok: false,
      reason: 'provider_error',
      data: null,
      usage: { latencyMs: Date.now() - started },
    };
  }
}

module.exports = { generateJson, status, extractJson };
