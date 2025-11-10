onst logger = require('../utils/logger');

async function parsePage(page, response, options = {}) {
const { customData = null, proxyInfo = null } = options;
const timestamp = Date.now();

let url = '';
let title = '';
let content = '';
let links = [];
let statusCode = null;
let error = null;

try {
url = page.url();
} catch (err) {
logger.warn(`Unable to read page URL: ${err.message}`);
}

try {
title = await page.title();
} catch (err) {
logger.warn(`Unable to read title for ${url}: ${err.message}`);
}

try {
content = await page.content();
} catch (err) {
logger.warn(`Unable to read HTML content for ${url}: ${err.message}`);
}

try {
links = await page.$$eval('a[href]', (anchors) => {
const urls = anchors
.map((a) => {
try {
const href = a.getAttribute('href');
if (!href) return null;
const u = new URL(href, document.baseURI);
return u.href;
} catch {
return null;
}
})
.filter(Boolean);

return Array.from(new Set(urls));
});
} catch (err) {
logger.warn(`Unable to extract links for ${url}: ${err.message}`);
}

try {
if (response) {
statusCode = response.status();
}
} catch (err) {
logger.warn(`Unable to read status code for ${url}: ${err.message}`);
}

const record = {
url,
title,
content,
links,
statusCode,
timestamp,
customData,
proxyInfo,
error,
};

return record;
}

module.exports = {
parsePage,
};