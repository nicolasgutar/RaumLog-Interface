FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .

# Public Firebase client config — safe to bake in (visible in browser bundle regardless)
ENV VITE_FIREBASE_API_KEY=AIzaSyCaowh1eT4i0B0FidnD8RIMfhOOr075KeA
ENV VITE_FIREBASE_AUTH_DOMAIN=raumlog-e5b0f.firebaseapp.com
ENV VITE_FIREBASE_PROJECT_ID=raumlog-e5b0f
ENV VITE_FIREBASE_STORAGE_BUCKET=raumlog-e5b0f.firebasestorage.app
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=315182199687
ENV VITE_FIREBASE_APP_ID=1:315182199687:web:315223422d3c94a0fd5922
ENV VITE_API_BASE_URL=https://raumlog-production-379615565756.us-central1.run.app

# Install all dependencies required for the build
RUN pnpm install --frozen-lockfile

# The libraries @workspace/db and @workspace/api-zod are source-only 
# and will be bundled directly by the app builds below.
# Build the api server
RUN pnpm --filter @workspace/api-server build
# Build the frontend react app
RUN pnpm --filter @workspace/raumlog build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app /app
ENV PORT=8080
ENV NODE_ENV=production

# Expose standard Cloud Run port
EXPOSE 8080

# Run from the monolithic workspace
CMD ["pnpm", "--filter", "@workspace/api-server", "start"]
