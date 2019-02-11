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
  ORIGIN = DEFAULT_ORIGIN
} = process.env;

app.use('*', cors({ origin: ORIGIN, credentials: true }));
app.use('/', proxy(PROXY_URL, {
  userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
    headers['access-control-allow-origin'] = ORIGIN;
    return headers;
  }
}));

app.listen(PORT, () => console.log(`EXPRESS Server listening on ${PORT}`));
