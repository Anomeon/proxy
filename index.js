const dotenv = require('dotenv');
const Express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const path= require('path');
const app = new Express();


const DEFAULT_ENV_FILE = '.env';

// Helpers
const getEnvFile = () => {
	const envFileArgIndex = process.argv.indexOf('--env-file');
	if (envFileArgIndex > -1) {
	  const envFileIndex = envFileArgIndex + 1;
	  const envFile = process.argv[envFileIndex];
	  return envFile;
	}
	return DEFAULT_ENV_FILE;
};


// Load env file
dotenv.load({ path: path.resolve(process.cwd(), getEnvFile()) });


// Setup
const {
    PORT,
    PROXY_URL,
    COOKIE_DOMAIN,
    ORIGIN,
} = process.env;

const EXTRA_PROXY_MAPPING_RULES = JSON.parse(process.env.EXTRA_PROXY_MAPPING_RULES);
const PATH_REPLACE_RULES = JSON.parse(process.env.PATH_REPLACE_RULES);
const HTTPS = JSON.parse(process.env.HTTPS);


// Init
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
    https: HTTPS,
    limit: '20mb',
    proxyReqPathResolver: (req) => {
      const [path, query] = req.url.split('?');
      const updatedPath = PATH_REPLACE_RULES.reduce((acc, { pattern, replacement }) => {
        return acc.replace(pattern, replacement);
      }, path);
      const queryString = query ? `?${query}` : '';

      return `${updatedPath}${queryString}`;
    },
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
