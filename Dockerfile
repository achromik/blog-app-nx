FROM node:16.11.1-alpine3.11 as builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

COPY . .

RUN apk add --no-cache --virtual .gyp python make g++ 

RUN npm i

RUN apk del .gyp