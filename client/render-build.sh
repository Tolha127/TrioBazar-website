#!/bin/bash
# filepath: c:\Users\DELL\Documents\Ubaydah's Website\TrioBazar-website\render-build.sh

# Navigate to client directory
cd client

# Install dependencies
npm install

# Set increased memory for Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# Build the client application
npm run build

# Check if build directory exists
if [ -d "build" ]; then
  echo "Build completed successfully. Build directory exists."
else
  echo "Build failed. Build directory does not exist."
  exit 1
fi

# Print contents of the build directory
echo "Contents of build directory:"
ls -la build