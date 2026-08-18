import { SYSTEM_INSTRUCTIONS } from './tripPlanner.prompt.js';

export function buildBudgetPrompt(input) {
  return `${SYSTEM_INSTRUCTIONS}

TASK: Reduce a trip's total estimated cost to fit a new lower budget.
Current budget: ${input.currentBudget}
Target budget: ${input.targetBudget}
Current plan: ${JSON.stringify(input.itinerary || [])}

Suggest cheaper hotels, cheaper transport, and free attractions. Preserve the
most important activities. Return JSON: { "budgetBreakdown": {...}, "itinerary": [...], "notes": string }`;
}
