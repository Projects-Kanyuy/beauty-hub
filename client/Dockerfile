# Stage 1: Build the React app
FROM node:20.9.0-alpine3.18 AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy source code
COPY . .

# Build the app for production
COPY .env.example .env
RUN npm run build


# Stage 2: Production image
FROM node:20.9.0-alpine3.18 AS runner

# Set working directory
WORKDIR /app

# Set environment variables for runtime
ENV NODE_ENV=production \
    PORT=3000

# Copy only necessary files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/node_modules ./node_modules

# Copy supporting scripts and environment files
COPY build_and_run.sh search_and_replace_env.js .env.example ./

# Make sure the script is executable
RUN chmod +x /app/build_and_run.sh

# Expose the app port
EXPOSE 3000

# Use /bin/sh to run your entry script
ENTRYPOINT ["/bin/sh"]
CMD ["/app/build_and_run.sh"]
