onst logger = require('../utils/logger');

/**
* Hook executed before each navigation.
* Customize interactions here (e.g., set cookies, block resources, etc.).
*/
async function beforeNavigation(page, context) {
const { url, depth } = context;
logger.debug(`beforeNavigation hook: ${url} (depth=${depth})`);

// Example: optionally block heavy assets
if (process.env.BLOCK_MEDIA === 'true') {
await page.route('**/*', (route) => {
const request = route.request();
const resourceType = request.resourceType();
if (['image', 'font', 'media'].includes(resourceType)) {
return route.abort();
}
return route.continue();
});
}
}

/**
* Hook executed after each page is parsed.
* Use this to implement custom business logic, extra scraping, etc.
*/
async function afterNavigation(page, context) {
const { record, depth } = context;
logger.debug(
`afterNavigation hook: scraped ${record.url} at depth=${depth} (status=${record.statusCode})`
);

// Example: take a screenshot for debugging if enabled
if (process.env.SAVE_SCREENSHOTS === 'true') {
const safeUrl = record.url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
const fileName = `screenshot_${safeUrl}_${Date.now()}.png`;
try {
await page.screenshot({ path: fileName, fullPage: true });
logger.debug(`Saved screenshot: ${fileName}`);
} catch (err) {
logger.warn(`Unable to save screenshot for ${record.url}: ${err.message}`);
}
}
}

module.exports = {
beforeNavigation,
afterNavigation,
};