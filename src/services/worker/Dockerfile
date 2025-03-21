# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to cache dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Compile TypeScript
RUN npm run build

# Expose a port if needed (not strictly necessary for a worker)
EXPOSE 3001

# Start the worker service
CMD ["npm", "run", "start"]
