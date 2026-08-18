import { SYSTEM_INSTRUCTIONS } from './tripPlanner.prompt.js';

export function buildReplanPrompt(input) {
  return `${SYSTEM_INSTRUCTIONS}

TASK: Re-plan a trip because the user reported a disruption.
Disruption: ${input.reason}
Current time context: ${input.context || 'unknown'}
Remaining itinerary: ${JSON.stringify(input.itinerary || [])}

Rules: remove impossible activities, keep high-priority items, suggest replacements,
preserve the budget. Return JSON: { "itinerary": [...], "notes": string }`;
}
