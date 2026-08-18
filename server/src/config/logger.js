const SENSITIVE = /password|token|secret|authorization|cookie|apikey|api_key|refresh/i;

function redact(value) {
  if (value == null) return value;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(redact);
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = SENSITIVE.test(k) ? '[redacted]' : redact(v);
    }
    return out;
  }
  return value;
}

function log(level, message, meta = {}) {
  const line = {
    level,
    time: new Date().toISOString(),
    message,
    ...redact(meta),
  };
  const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
  console[method](JSON.stringify(line));
}

const logger = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
  audit: (action, meta) => log('info', `audit:${action}`, meta),
};

module.exports = { logger, redact };
