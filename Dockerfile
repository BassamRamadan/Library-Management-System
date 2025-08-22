# Use official Node.js LTS image
FROM node:18

WORKDIR /app

# Copy package files and install deps first for better caching
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
