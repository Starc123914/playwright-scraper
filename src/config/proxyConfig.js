function parseProxyUrl(raw) {
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const hasAuth = url.username || url.password;

    return {
      url: raw,
      protocol: url.protocol.replace(':', ''),
      host: url.hostname,
      port: url.port ? Number(url.port) : undefined,
      username: hasAuth ? decodeURIComponent(url.username) : undefined,
      password: hasAuth ? decodeURIComponent(url.password) : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Returns logical proxy information used for logging and record metadata.
 */
function getProxyInfo() {
  const raw = process.env.PROXY_URL || '';
  const parsed = parseProxyUrl(raw);
  return parsed;
}

/**
 * Returns proxy config in the shape expected by Playwright's `launch` options.
 */
function getPlaywrightProxyConfig() {
  const info = getProxyInfo();
  if (!info) return null;

  return {
    server: info.url,
    username: info.username,
    password: info.password,
  };
}

module.exports = {
  getProxyInfo,
  getPlaywrightProxyConfig,
};