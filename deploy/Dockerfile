FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/rag-core/package.json packages/rag-core/
COPY packages/mcp-server/package.json packages/mcp-server/
COPY packages/mcp-http/package.json packages/mcp-http/
RUN npm ci --workspace @avril/rag-core --workspace @avril/mcp-server --workspace @avril/mcp-http

FROM deps AS build
COPY packages/rag-core packages/rag-core
COPY packages/mcp-server packages/mcp-server
COPY packages/mcp-http packages/mcp-http
RUN npm run build -w @avril/rag-core \
  && npm run build -w @avril/mcp-server \
  && npm run build -w @avril/mcp-http

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV MCP_HOST=0.0.0.0
ENV MCP_PORT=3012

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/rag-core/dist ./packages/rag-core/dist
COPY --from=build /app/packages/rag-core/package.json ./packages/rag-core/
COPY --from=build /app/packages/mcp-server/dist ./packages/mcp-server/dist
COPY --from=build /app/packages/mcp-server/package.json ./packages/mcp-server/
COPY --from=build /app/packages/mcp-http/dist ./packages/mcp-http/dist
COPY --from=build /app/packages/mcp-http/package.json ./packages/mcp-http/
COPY package.json ./

EXPOSE 3012
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- --header="Host: localhost" http://127.0.0.1:3012/health || exit 1

CMD ["node", "packages/mcp-http/dist/server.js"]
