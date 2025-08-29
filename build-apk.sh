#!/bin/bash

echo "Building Chicker APK..."

# Build the web assets
echo "Building web assets..."
npm run build

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync android

# Create a simple APK build without React Native autolinking
echo "Building APK..."
cd android

# Disable autolinking temporarily
sed -i.bak 's/autolinkLibrariesWithApp()/\/\/ autolinkLibrariesWithApp()/' app/build.gradle

# Build the APK
./gradlew assembleRelease

# Restore the original build.gradle
mv app/build.gradle.bak app/build.gradle

echo "APK built successfully!"
echo "Location: android/app/build/outputs/apk/release/app-release.apk"