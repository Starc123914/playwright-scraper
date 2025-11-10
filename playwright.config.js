js/**
 * Lightweight configuration for the Playwright Scraper runtime.
 * This is NOT a Playwright Test config, but rather a central place
 * for default crawl settings when environment variables are not provided.
 */

module.exports = {
  browser: process.env.BROWSER || 'chromium',
  headless: process.env.HEADLESS === 'false' ? false : true,
  maxDepth: Number.isNaN(Number(process.env.MAX_DEPTH))
    ? 1
    : Number(process.env.MAX_DEPTH || 1),
  maxPages: Number.isNaN(Number(process.env.MAX_PAGES))
    ? 50
    : Number(process.env.MAX_PAGES || 50),
  concurrency: Number.isNaN(Number(process.env.CONCURRENCY))
    ? 2
    : Number(process.env.CONCURRENCY || 2),
};