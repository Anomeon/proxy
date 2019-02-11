const Express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');

const app = new Express();
const origin = 'http://localhost:3000';
const proxyUrl = 'http://localhost:8080';
const listeningPort = 3006;

app.use('*', cors({ origin, credentials: true }));
app.use('/', proxy(proxyUrl, {
  userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
    headers['access-control-allow-origin'] = origin;
    return headers;
  }
}));
app.listen(listeningPort, () => console.log(`EXPRESS Server listening on ${listeningPort}`));

