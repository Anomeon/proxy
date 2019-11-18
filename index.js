require('dotenv').load();
const Express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const app = new Express();

const DEFAULT_ORIGIN = 'http://localhost:3000';
const DEFAULT_PORT = '8080';

const {
    PORT = DEFAULT_PORT,
    PROXY_URL,
    COOKIE_DOMAIN,
    ORIGIN = DEFAULT_ORIGIN,
} = process.env;

const EXTRA_PROXY_MAPPING_RULES = process.env.EXTRA_PROXY_MAPPING_RULES
  ? JSON.parse(process.env.EXTRA_PROXY_MAPPING_RULES)
  : [];

app.use('*', cors({ origin: ORIGIN, credentials: true }));

app.use('/', proxy(
  (request) => {
    const proxyUrlFromRule = EXTRA_PROXY_MAPPING_RULES.reduce((acc, rule) => {
      if (acc === '' && request.url.indexOf(rule.requestUrlPart) !== -1) {
        return rule.proxyUrl;
      }
      return acc;
    }, '');
    const currentProxyUrl = proxyUrlFromRule === '' ? PROXY_URL : proxyUrlFromRule;
    console.log(`url: ${currentProxyUrl}${request.url}`);
    return currentProxyUrl;
  },
  {
    https: true,
    userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
      headers['access-control-allow-origin'] = ORIGIN;
      if (headers["set-cookie"]) {
        headers["set-cookie"] = headers["set-cookie"].map(element => element.replace(`domain=${COOKIE_DOMAIN}`, 'domain=localhost'));
      }
      return headers;
    },
  }
));
app.listen(PORT, () => console.log(`Proxying ${PROXY_URL} to localhost:${PORT} with origin ${ORIGIN}`));
