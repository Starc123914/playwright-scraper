require('dotenv').config();
const path = require('path');
const fs = require('fs');
const logger = require('./utils/logger');
const { runCrawler } = require('./crawler/playwrightRunner');

function getStartUrls() {
  if (process.env.START_URLS) {
    const fromEnv = process.env.START_URLS.split(',')
      .map((u) => u.trim())
      .filter(Boolean);

    if (fromEnv.length) {
      return fromEnv;
    }
  }

  const filePath = path.resolve(__dirname, '..', 'data', 'inputUrls.json');

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (Array.isArray(parsed.urls)) {
      return parsed.urls;
    }

    logger.warn(
      'inputUrls.json format not recognized. Expected an array or { "urls": [] }.'
    );
  } catch (err) {
    logger.error(`Failed to read inputUrls.json: ${err.message}`);
  }

  logger.warn('Falling back to default URL: https://example.com');
  return ['https://example.com'];
}

(async () => {
  const startUrls = getStartUrls();
  const outputDir =
    process.env.OUTPUT_DIR || path.resolve(__dirname, '..', 'data');
  const maxDepth = Number.isNaN(Number(process.env.MAX_DEPTH))
    ? 1
    : Number(process.env.MAX_DEPTH || 1);
  const maxPages = Number.isNaN(Number(process.env.MAX_PAGES))
    ? 50
    : Number(process.env.MAX_PAGES || 50);

  logger.info(
    `Starting crawl with ${startUrls.length} start URL(s), maxDepth=${maxDepth}, maxPages=${maxPages}`
  );

  try {
    const results = await runCrawler({
      startUrls,
      outputDir,
      maxDepth,
      maxPages,
    });

    logger.info(`Crawl finished. Collected ${results.length} page(s).`);
  } catch (err) {
    logger.error(`Crawler failed: ${err.stack || err.message}`);
    process.exitCode = 1;
  }
})();