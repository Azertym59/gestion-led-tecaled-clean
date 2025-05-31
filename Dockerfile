FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Force production build
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files and install production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]