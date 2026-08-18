import { SYSTEM_INSTRUCTIONS } from './tripPlanner.prompt.js';

export function buildItineraryPrompt(input) {
  return `${SYSTEM_INSTRUCTIONS}

TASK: Optimize/refine an itinerary day.
Current itinerary: ${JSON.stringify(input.itinerary || [])}
User request: ${input.request}

Return JSON: { "itinerary": [ <same day/item shape as the trip planner> ] }`;
}
