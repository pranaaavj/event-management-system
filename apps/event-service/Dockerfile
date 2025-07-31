FROM node:18 AS builder
WORKDIR /app
COPY package.json .
COPY packages/proto ./packages/proto
RUN npm install --workspace=proto && npm run build --workspace=proto
COPY apps/event-service ./apps/event-service
RUN npm install --workspace=apps/event-service && npm run build --workspace=apps/event-service

FROM node:18
WORKDIR /app
COPY --from=builder /app/packages/proto/dist ./packages/proto/dist
COPY --from=builder /app/apps/event-service/dist ./dist
COPY --from=builder /app/apps/event-service/package.json .
RUN npm install --production
EXPOSE 50052
CMD ["node", "dist/index.js"]