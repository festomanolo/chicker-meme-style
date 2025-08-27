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

# Sync with Capacitor
echo "⚡ Syncing with Capacitor..."
npm run cap:sync

# Build Android APK
echo "🤖 Building Android APK..."
cd android && ./gradlew assembleRelease -x generateAutolinkingPackageList
cd ..

# Build Android Bundle (for Play Store)
echo "📱 Building Android Bundle..."
cd android && ./gradlew bundleRelease -x generateAutolinkingPackageList
cd ..

echo "✅ Production build complete!"
echo "📍 APK location: android/app/build/outputs/apk/release/app-release.apk"
echo "📍 Bundle location: android/app/build/outputs/bundle/release/app-release.aab"