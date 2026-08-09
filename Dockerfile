# Use official Node.js runtime as a parent image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Accept build-time API URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the React application
RUN npm run build

# Production stage
FROM node:20-alpine

# Install serve to run the React app
RUN npm install -g serve

WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["serve", "-s", "dist", "-l", "5173"]
