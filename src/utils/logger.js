onst levels = ['error', 'warn', 'info', 'debug'];

const envLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
const currentLevelIndex = levels.indexOf(envLevel) === -1 ? 2 : levels.indexOf(envLevel);

function log(level, message) {
  const idx = levels.indexOf(level);
  if (idx === -1 || idx > currentLevelIndex) return;

  const ts = new Date().toISOString();
  const line = `[${ts}] [${level.toUpperCase()}] ${message}`;

  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

module.exports = {
  error: (msg) => log('error', msg),
  warn: (msg) => log('warn', msg),
  info: (msg) => log('info', msg),
  debug: (msg) => log('debug', msg),
};