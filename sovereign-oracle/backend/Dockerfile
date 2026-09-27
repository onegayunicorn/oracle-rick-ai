# Stage 1: Build & prune
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY shared ./shared
COPY backend ./backend
RUN pnpm install --frozen-lockfile
RUN pnpm --filter backend build
RUN pnpm --filter backend --prod deploy /app/pruned

# Stage 2: Minimal runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/pruned ./
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --spider -q --tries=1 http://localhost:3000/healthz || exit 1
ENTRYPOINT ["node", "dist/server.js"]
