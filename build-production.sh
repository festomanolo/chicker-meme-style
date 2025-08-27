#!/bin/bash

echo "🚀 Building Chicker for Production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean:android
rm -rf dist/
rm -rf node_modules/.cache/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build web version
echo "🌐 Building web version..."
npm run build

