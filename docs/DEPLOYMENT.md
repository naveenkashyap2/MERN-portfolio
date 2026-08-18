# Deployment

1. Set production env: `MONGODB_URI`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `CLIENT_URL`, `GEMINI_API_KEY`, Google OAuth, SMTP.
2. `USE_IN_MEMORY_DB=false`
3. Build client: `cd client && npm run build`
4. Serve `client/dist` behind the API or a CDN; proxy `/api` to the Node process.
5. Enable HTTPS. Cookies use `Secure` + `SameSite=none` in production.

Health: `GET /api/v1/health`  
OpenAPI: `GET /api/v1/docs`
