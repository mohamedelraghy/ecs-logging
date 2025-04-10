# Use Node.js base image
FROM node:23-slim

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (change if needed)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]