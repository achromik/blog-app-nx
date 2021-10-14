FROM node:16.11.1-alpine3.11 as builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

COPY . .

RUN apk add --no-cache --virtual .gyp python make g++ 

RUN npm i

RUN apk del .gyp

RUN npx nx build backend ${BUILD_FLAG}



FROM node:16.11.1-alpine3.11

WORKDIR /app

COPY --from=builder /app/builder ./
ENV NODE_ENV=$NODE_ENV

CMD ["node", "./dist/apps/backend/main.js"]
