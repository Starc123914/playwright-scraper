onst fs = require('fs');
const path = require('path');
const logger = require('./logger');

async function ensureDirExists(dirPath) {
try {
await fs.promises.mkdir(dirPath, { recursive: true });
} catch (err) {
if (err.code !== 'EEXIST') {
throw err;
}
}
}

async function writeJson(filePath, data) {
const dir = path.dirname(filePath);
await ensureDirExists(dir);

const serialized = JSON.stringify(data, null, 2);

await fs.promises.writeFile(filePath, serialized, 'utf8');
logger.info(`Wrote JSON file: ${filePath}`);
}

async function writeText(filePath, text) {
const dir = path.dirname(filePath);
await ensureDirExists(dir);

await fs.promises.writeFile(filePath, text, 'utf8');
logger.info(`Wrote text file: ${filePath}`);
}

module.exports = {
ensureDirExists,
writeJson,
writeText,
};