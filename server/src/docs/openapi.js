const spec = {
  openapi: '3.0.3',
  info: {
    title: 'YatraGenie AI API',
    version: '1.0.0',
    description: 'India AI travel OS. Live transport/hotel availability is never invented.',
  },
  servers: [{ url: '/api/v1' }],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Trips' },
    { name: 'AI' },
    { name: 'Assistant' },
    { name: 'Location' },
    { name: 'Transport' },
    { name: 'Hotels' },
    { name: 'Places' },
    { name: 'Health' },
  ],
  paths: {
    '/health': { get: { tags: ['Health'], summary: 'API liveness', responses: { 200: { description: 'OK' } } } },
    '/health/database': { get: { tags: ['Health'], summary: 'Database ping', responses: { 200: { description: 'OK' } } } },
    '/health/services': { get: { tags: ['Health'], summary: 'Provider status', responses: { 200: { description: 'OK' } } } },
    '/auth/register': { post: { tags: ['Auth'], summary: 'Register', responses: { 201: { description: 'Created' } } } },
    '/auth/login': { post: { tags: ['Auth'], summary: 'Login', responses: { 200: { description: 'OK' } } } },
    '/auth/google': { post: { tags: ['Auth'], summary: 'Google OAuth', responses: { 200: { description: 'OK' } } } },
    '/auth/refresh': { post: { tags: ['Auth'], summary: 'Refresh session', responses: { 200: { description: 'OK' } } } },
    '/auth/logout': { post: { tags: ['Auth'], summary: 'Logout', responses: { 200: { description: 'OK' } } } },
    '/auth/forgot-password': { post: { tags: ['Auth'], summary: 'Forgot password', responses: { 200: { description: 'OK' } } } },
    '/auth/reset-password': { post: { tags: ['Auth'], summary: 'Reset password', responses: { 200: { description: 'OK' } } } },
    '/auth/verify-email': { post: { tags: ['Auth'], summary: 'Verify email', responses: { 200: { description: 'OK' } } } },
    '/auth/me': { get: { tags: ['Auth'], summary: 'Current user', security: [{ cookieAuth: [] }], responses: { 200: { description: 'OK' } } } },
    '/trips': {
      get: { tags: ['Trips'], summary: 'List trips', security: [{ cookieAuth: [] }], responses: { 200: { description: 'OK' } } },
      post: { tags: ['Trips'], summary: 'Create trip', security: [{ cookieAuth: [] }], responses: { 201: { description: 'Created' } } },
    },
    '/ai/trip/generate': {
      post: { tags: ['AI'], summary: 'Generate itinerary', security: [{ cookieAuth: [] }], responses: { 200: { description: 'OK' } } },
    },
    '/assistant/chat': {
      post: { tags: ['Assistant'], summary: 'Chat', security: [{ cookieAuth: [] }], responses: { 200: { description: 'OK' } } },
    },
    '/places/search': { get: { tags: ['Places'], summary: 'Search catalog places', responses: { 200: { description: 'OK' } } } },
    '/transport/trains/search': {
      get: { tags: ['Transport'], summary: 'Search trains (verified only when provider connected)', responses: { 200: { description: 'OK' } } },
    },
    '/hotels/search': { get: { tags: ['Hotels'], summary: 'Search stay catalog', responses: { 200: { description: 'OK' } } } },
  },
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'yg_access' },
    },
  },
};

module.exports = { spec };
