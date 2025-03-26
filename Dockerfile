FROM node:current-alpine

ARG API_GATEWAY_HOST_PORT

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json  ./
COPY public/ ./public
COPY src/ ./src
RUN sed -i "s/#API_GATEWAY_HOST_PORT#/${API_GATEWAY_HOST_PORT}/g" src/common.js
RUN npm install
RUN npm install -g serve
RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]


