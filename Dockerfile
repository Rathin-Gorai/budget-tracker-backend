# -----------------------------
# Express + Node + Sequelize Dev
# -----------------------------
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install build tools for pg / bcrypt
RUN apk add --no-cache bash python3 make g++

# Copy package files first (for caching)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose app port
EXPOSE 5000

# Start server in watch mode
CMD ["npx", "nodemon", "--legacy-watch", "index.js"]
