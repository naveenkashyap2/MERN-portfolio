# AI

## Correct architecture

```
React → Express API → AI Controller → AI Service → Prompt Builder → Gemini API
                        ↓ validate (Zod) → sanitize → MongoDB
```

React **never** calls Gemini directly. The API key exists only in backend environment variables.

## Providers
`server/src/providers/gemini` wraps `@google/generative-ai`. If `GEMINI_API_KEY` is unset,
`available()` is false and the AI service falls back to a deterministic demo planner built from the
seed catalog — so the product always works.

## Prompt architecture
Versioned prompts in `server/src/prompts`:
- `tripPlanner.prompt.js` (TRIP_PLANNER_V1) — structured JSON trip output
- `itinerary.prompt.js`, `replan.prompt.js`, `budget.prompt.js`, `assistant.prompt.js`

System instructions are kept separate from untrusted user input; the user block is clearly marked
and the model is instructed to respond with JSON only.

## Hallucination protection
The system prompt forbids inventing live availability, exact prices, coordinates, opening hours or
real-time status. Anything generated is labelled "estimate" in the UI. If verified data is
unavailable, the UI says so explicitly.

## Output pipeline
`JSON parse → Zod schema → business validation → sanitize → save`. Invalid output is rejected and
falls back safely. Raw Gemini output is never persisted blindly.

## Cost control
AI endpoints are rate-limited (per user per hour). Prompt/response sizes are bounded. Usage
(tokens, latency, success/failure) is intended to be tracked per request.
