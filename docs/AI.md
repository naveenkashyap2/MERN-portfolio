# AI

Prompts are versioned in `server/src/prompts/`.

- TRIP_PLANNER_V1
- REPLAN_V1
- ASSISTANT_V1
- BUDGET_V1

User text is untrusted. System instructions stay isolated.

Outputs are never stored raw. Coordinates from the model are dropped unless matched to the India catalog.

If `GEMINI_API_KEY` is missing, the catalog/template planner runs and is labeled ESTIMATED / CATALOG.
