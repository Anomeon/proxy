const Express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const app = new Express();

app.options('*', cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/', proxy('http://localhost:8080'));
app.listen(3006, () => console.log(`EXPRESS Server listening on 3006`));
