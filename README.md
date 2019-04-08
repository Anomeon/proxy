## How to
- Install dependencies
```bash
npm i
```
- Describe env variables (see example in Env setup)
- Launch node
```bash
npm start
```
- Profit!!

## Env setup

```bash
cp .env.default .env
```

### Required environment vars
- PROXY_URL - url which you wanna proxying
- COOKIE_DOMAIN - domain which will use in cookies

### Other environment vars
- PORT - by default is 8080
- ORIGIN - by default is http://localhost:3000
