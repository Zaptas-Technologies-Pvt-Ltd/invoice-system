# Use the official Node.js image
FROM node:20.17.0

# Set the working directory for the backend
WORKDIR /usr/src/app/backend

# Copy package.json and package-lock.json (if available) for backend
COPY backend/package*.json ./

# Install the backend dependencies
RUN npm install

# Copy the rest of the backend application code
COPY backend/ .

# Expose the port your backend app runs on (adjust if necessary)
EXPOSE 8080

# Command to run the backend application
CMD ["node", "server.js"]
