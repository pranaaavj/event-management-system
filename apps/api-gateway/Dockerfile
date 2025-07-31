# Build stage
FROM node:18 AS builder
WORKDIR /app
# Copy root package.json and lock file for Turborepo
COPY package.json package-lock.json ./
# Copy proto package
COPY packages/proto ./packages/proto
# Install dependencies and build proto package
RUN npm install --workspace=proto && npm run build --workspace=proto
# Copy api-gateway source
COPY apps/api-gateway ./apps/api-gateway
# Install dependencies and build api-gateway
RUN npm install --workspace=apps/api-gateway && npm run build --workspace=apps/api-gateway

# Runtime stage
FROM node:18
WORKDIR /app
# Copy compiled proto files and proto source (needed for proto-loader)
COPY --from=builder /app/packages/proto/src ./packages/proto/src
COPY --from=builder /app/packages/proto/dist ./packages/proto/dist
# Copy compiled api-gateway files
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/apps/api-gateway/package.json ./package.json
# Install production dependencies
RUN npm install --production
EXPOSE 3000
CMD ["node", "dist/index.js"]