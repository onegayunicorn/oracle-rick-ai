FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY shared ./shared
COPY frontend ./frontend
RUN pnpm install --frozen-lockfile
RUN pnpm --filter frontend build

FROM nginx:alpine-slim AS runner
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget --spider -q http://localhost:80/ || exit 1
