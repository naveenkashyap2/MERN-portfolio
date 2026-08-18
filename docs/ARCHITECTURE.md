# Architecture

```
React (Vite) → /api/v1 (same origin via Vite proxy)
  → Express controllers
  → services
  → providers (gemini | maps | transport | hotels | places)
  → MongoDB
```

Identity is taken only from the verified access cookie/token. Resource APIs check ownership and return 404 on IDOR.

AI pipeline: prompt builder → Gemini (if configured) → JSON parse → schema/business validation → sanitize → persist. Template/catalog planner is the labeled fallback.
