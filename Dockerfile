# ベース（Corepack 有効化）
FROM node:20-slim AS base
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# pnpm を Corepack で有効化（Node 20 推奨）
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

# 依存関係のインストールステージ
FROM base AS deps
WORKDIR /app

# 依存関係ファイルのみコピー
# monorepo の場合は pnpm-workspace.yaml 等もここでコピーしてください
COPY package.json pnpm-lock.yaml ./

# （任意）高速化：BuildKit キャッシュを使う場合
# RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --frozen-lockfile
RUN pnpm install --frozen-lockfile

# ビルドステージ
FROM base AS builder
WORKDIR /app

# node_modules を先にコピー（devDeps を含む）
COPY --from=deps /app/node_modules ./node_modules

# アプリ本体をコピー
COPY . .

RUN pnpm build

# 実行ステージ（最小）
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Cloud Run から注入される PORT で listen、0.0.0.0 必須
ENV HOSTNAME=0.0.0.0

# 非rootユーザー作成
RUN addgroup --system --gid 1001 nextjs \
  && adduser --system --uid 1001 nextjs

# public と .next/static は相対配置が重要
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
# standalone には server.js と必要な node_modules が内包される
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
# 一部ライブラリが参照する可能性があるため package.json も置いておくと安全
COPY --from=builder --chown=nextjs:nextjs /app/package.json ./package.json

USER nextjs

EXPOSE 8080
CMD ["node", "server.js"]
