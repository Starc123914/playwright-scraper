onst DEFAULT_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
];

function getRandomUserAgent() {
  const idx = Math.floor(Math.random() * DEFAULT_USER_AGENTS.length);
  return DEFAULT_USER_AGENTS[idx];
}

const browserSettings = {
  browserType: process.env.BROWSER || 'chromium',
  headless: process.env.HEADLESS === 'false' ? false : true,
  navigationTimeoutMs: Number.isNaN(Number(process.env.NAV_TIMEOUT))
    ? 30000
    : Number(process.env.NAV_TIMEOUT || 30000),
  maxConcurrency: Number.isNaN(Number(process.env.CONCURRENCY))
    ? 2
    : Number(process.env.CONCURRENCY || 2),
  userAgents: DEFAULT_USER_AGENTS,
  getRandomUserAgent,
};

module.exports = browserSettings;