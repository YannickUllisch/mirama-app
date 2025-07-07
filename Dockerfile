FROM node:20-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    libc6-dev \
    python3 \
    make \
    g++ \
    build-essential \
    openssl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock* ./
RUN echo 'nodeLinker: "node-modules"' > ./.yarnrc.yml
RUN yarn install --immutable --production=false

COPY ./src ./src
COPY ./app ./app
COPY ./middleware.ts ./
COPY ./postcss.config.js ./
COPY ./tailwind.config.ts ./
COPY ./next.config.mjs ./tsconfig.json ./
COPY ./prisma ./prisma
COPY ./public ./public

# Generate Prisma client after copying schema
RUN yarn prisma generate

RUN yarn build

# --- Runtime image ---
FROM node:20-alpine AS runner

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Add non-root user
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# Copy only production node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]