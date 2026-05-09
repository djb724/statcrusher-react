# Use an official Node image for building the app
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only package*.json for caching)
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# ---------------------------------------------------------
# Production image — only includes necessary runtime files
FROM node:22-alpine AS runner

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create and use a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy only the build output and production dependencies
COPY --from=builder /app/package*.json ./
RUN npm i --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Expose port
EXPOSE 3000

# Use non-root user
USER nextjs

# Run the app
CMD ["npm", "start"]
