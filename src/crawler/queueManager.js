onst { URL } = require('url');

class QueueManager {
constructor(startUrls, options = {}) {
const { maxDepth = 1, sameOrigin = true } = options;
this.maxDepth = maxDepth;
this.sameOrigin = sameOrigin;

this.queue = [];
this.visited = new Set();
this.startOrigins = new Set();

const normalized = (Array.isArray(startUrls) ? startUrls : [])
.map((u) => String(u).trim())
.filter(Boolean);

normalized.forEach((url) => {
try {
const u = new URL(url);
this.startOrigins.add(u.origin);
this.queue.push({ url: u.toString(), depth: 0, customData: null });
} catch {
// Invalid URL ignored
}
});
}

hasNext() {
return this.queue.length > 0;
}

next() {
while (this.queue.length > 0) {
const item = this.queue.shift();
if (!this.visited.has(item.url)) {
this.visited.add(item.url);
return item;
}
}
return null;
}

addDiscoveredUrls(fromUrl, links, depth) {
if (!Array.isArray(links) || depth > this.maxDepth) {
return;
}

let origin;
try {
origin = new URL(fromUrl).origin;
} catch {
origin = null;
}

for (const link of links) {
if (!link) continue;

let urlObj;
try {
urlObj = new URL(link);
} catch {
continue; // skip invalid
}

if (this.sameOrigin) {
const isSame =
this.startOrigins.has(urlObj.origin) ||
(origin && origin === urlObj.origin);
if (!isSame) continue;
}

const normalizedUrl = urlObj.toString();
if (this.visited.has(normalizedUrl)) continue;
if (this.queue.find((q) => q.url === normalizedUrl)) continue;

this.queue.push({ url: normalizedUrl, depth, customData: null });
}
}
}

module.exports = QueueManager;