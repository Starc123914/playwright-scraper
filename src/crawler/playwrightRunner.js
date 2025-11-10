onst { chromium, firefox, webkit } = require('playwright');
const path = require('path');
const logger = require('../utils/logger');
const browserSettings = require('../config/browserSettings');
const { getProxyInfo, getPlaywrightProxyConfig } = require('../config/proxyConfig');
const { parsePage } = require('../extractors/pageParser');
const { formatRecord } = require('../extractors/dataFormatter');
const QueueManager = require('./queueManager');
const { beforeNavigation, afterNavigation } = require('./hooks');
const { exportData } = require('../outputs/exportManager');

async function runCrawler(options) {
const {
startUrls,
outputDir,
maxDepth = 1,
maxPages = 50,
} = options;

if (!Array.isArray(startUrls) || startUrls.length === 0) {
throw new Error('runCrawler requires at least one start URL');
}

const queue = new QueueManager(startUrls, { maxDepth, sameOrigin: true });
const proxyInfo = getProxyInfo();
const playwrightProxyConfig = getPlaywrightProxyConfig();

const browserTypeName = (browserSettings.browserType || 'chromium').toLowerCase();
const browserType =
browserTypeName === 'firefox'
? firefox
: browserTypeName === 'webkit'
? webkit
: chromium;

logger.info(
`Launching ${browserTypeName} browser (headless=${browserSettings.headless})`
);

const browser = await browserType.launch({
headless: browserSettings.headless,
proxy: playwrightProxyConfig || undefined,
});

const results = [];
let processed = 0;

try {
while (queue.hasNext() && processed < maxPages) {
const item = queue.next();
if (!item) break;

const { url, depth, customData } = item;

logger.info(`Processing [${processed + 1}/${maxPages}] ${url} at depth ${depth}`);

const context = await browser.newContext({
userAgent: browserSettings.getRandomUserAgent(),
});

const page = await context.newPage();

try {
await beforeNavigation(page, { url, depth, customData });

let response;
try {
response = await page.goto(url, {
waitUntil: 'networkidle',
timeout: browserSettings.navigationTimeoutMs,
});
} catch (navErr) {
logger.warn(`Navigation error for ${url}: ${navErr.message}`);
}

const parsed = await parsePage(page, response, {
customData,
proxyInfo,
});

const formatted = formatRecord(parsed);
results.push(formatted);

await afterNavigation(page, { record: formatted, depth });

if (Array.isArray(formatted.links) && formatted.links.length > 0) {
queue.addDiscoveredUrls(url, formatted.links, depth + 1);
}

processed += 1;
} catch (err) {
logger.error(`Error while handling ${url}: ${err.stack || err.message}`);
} finally {
await context.close();
}
}
} finally {
logger.info('Closing browser instance');
await browser.close();
}

const baseFilename = `scrape-${Date.now()}`;
const formats = (process.env.OUTPUT_FORMATS || 'json')
.split(',')
.map((f) => f.trim().toLowerCase())
.filter(Boolean);

await exportData(results, {
outputDir,
baseFilename,
formats,
});

logger.info(
`Export complete. Files saved in ${path.resolve(outputDir)} with base name "${baseFilename}".`
);

return results;
}

module.exports = {
runCrawler,
};