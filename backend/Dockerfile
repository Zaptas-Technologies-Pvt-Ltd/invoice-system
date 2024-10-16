# Use the official Node.js image
FROM node:20.17.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY backend/package*.json ./backend/

# Install the dependencies
RUN npm install --prefix ./backend

# Copy the rest of the application code
COPY backend/ ./backend/

# Expose the port your app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "backend/server.js"]
