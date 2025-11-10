onst path = require('path');
const { writeJson, writeText, ensureDirExists } = require('../utils/storageHelper');

function toCsv(records) {
if (!Array.isArray(records) || records.length === 0) {
return '';
}

const fields = [
'url',
'title',
'content',
'links',
'statusCode',
'timestamp',
'customData',
'proxyInfo',
'error',
];

const escape = (value) => {
if (value === null || value === undefined) return '';
if (Array.isArray(value)) {
value = value.join(' ');
} else if (typeof value === 'object') {
value = JSON.stringify(value);
} else {
value = String(value);
}

if (/[",\n]/.test(value)) {
return `"${value.replace(/"/g, '""')}"`;
}

return value;
};

const header = fields.join(',');
const rows = records.map((rec) => {
return fields.map((field) => escape(rec[field])).join(',');
});

return [header, ...rows].join('\n');
}

async function exportData(records, options) {
const { outputDir, baseFilename, formats = ['json'] } = options || {};

if (!outputDir) {
throw new Error('outputDir is required for export');
}
if (!baseFilename) {
throw new Error('baseFilename is required for export');
}

await ensureDirExists(outputDir);

const uniqueFormats = Array.from(new Set(formats));

if (uniqueFormats.includes('json')) {
const jsonPath = path.join(outputDir, `${baseFilename}.json`);
await writeJson(jsonPath, records);
}

if (uniqueFormats.includes('csv')) {
const csvPath = path.join(outputDir, `${baseFilename}.csv`);
const csvText = toCsv(records);
await writeText(csvPath, csvText);
}
}

module.exports = {
exportData,
};