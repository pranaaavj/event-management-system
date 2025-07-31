
FROM node:18 AS builder
WORKDIR /app
COPY package.json .
COPY packages/proto ./packages/proto
RUN npm install --workspace=proto && npm run build --workspace=proto
COPY apps/ticket-service ./apps/ticket-service
RUN npm install --workspace=apps/ticket-service && npm run build --workspace=apps/ticket-service

FROM node:18
WORKDIR /app
COPY --from=builder /app/packages/proto/dist ./packages/proto/dist
COPY --from=builder /app/apps/ticket-service/dist ./dist
COPY --from=builder /app/apps/ticket-service/package.json .
RUN npm install --production
EXPOSE 50051
CMD ["node", "dist/index.js"]