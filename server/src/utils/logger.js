import env from '../config/env.js';

const RESET = '\x1b[0m';
const colors = {
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  debug: '\x1b[90m',
  success: '\x1b[32m',
};

function ts() {
  return new Date().toISOString();
}

function write(level, args) {
  const color = colors[level] || RESET;
  const prefix = `${color}[${level.toUpperCase()}]${RESET} ${ts()}`;
  // eslint-disable-next-line no-console
  console[level === 'error' ? 'error' : 'log'](prefix, ...args);
}

const logger = {
  info: (...a) => write('info', a),
  warn: (...a) => write('warn', a),
  error: (...a) => write('error', a),
  debug: (...a) => (env.NODE_ENV === 'development' ? write('debug', a) : undefined),
  success: (...a) => write('success', a),
};

export default logger;
