js/**
 * Ensures the record has all expected fields in a consistent shape.
 */
function formatRecord(record) {
  const {
    url = '',
    title = '',
    content = '',
    links = [],
    statusCode = null,
    timestamp = Date.now(),
    customData = null,
    proxyInfo = null,
    error = null,
  } = record || {};

  return {
    url,
    title,
    content,
    links: Array.isArray(links) ? links : [],
    statusCode: typeof statusCode === 'number' ? statusCode : null,
    timestamp: typeof timestamp === 'number' ? timestamp : Date.now(),
    customData: customData || null,
    proxyInfo: proxyInfo || null,
    error: error || null,
  };
}

module.exports = {
  formatRecord,
};