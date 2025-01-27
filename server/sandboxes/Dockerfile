# Use the official Node.js image with Alpine Linux as a base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /workspace

# Copy the application code into the container (but not install anything)
COPY . /workspace

# Expose necessary ports (8080 for web and 3000 for terminal, adjust as needed)
EXPOSE 5173 3000

# Start the container (but without running anything, just keep it running)
CMD ["tail", "-f", "/dev/null"]
