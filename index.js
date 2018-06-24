const Express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const app = new Express();

const origin = 'http://localhost:3000';

app.use('*', cors({ origin, credentials: true }));
app.use('/', proxy('http://localhost:8080', {
  userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
    headers['access-control-allow-origin'] = origin;
    return headers;
  }
}));
app.listen(3006, () => console.log(`EXPRESS Server listening on 3006`));
