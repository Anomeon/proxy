FROM node:12.18.4 as builder
WORKDIR /build
COPY package.json /build/package.json
COPY package-lock.json /build/package-lock.json
RUN npm i
COPY . /build

FROM node:12.18.4
COPY --from=builder /build /web
WORKDIR /web
CMD node index.js
