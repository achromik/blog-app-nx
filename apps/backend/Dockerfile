FROM blog-app-nx:base as builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

COPY . .

RUN npx nx build backend ${BUILD_FLAG}



FROM blog-app-nx:base

WORKDIR /app

COPY --from=builder /app/builder ./
ENV NODE_ENV=$NODE_ENV

CMD ["node", "./dist/apps/backend/main.js"]
