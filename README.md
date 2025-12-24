# Chicker - Meme T-Shirt App

A production-ready React Native app with Capacitor for selling meme t-shirts.

## Features

- 🎯 Optimized for production with minimal dependencies
- 📱 Native Android APK generation
- 🌐 Web support via Capacitor
- 🚀 Lightweight AsyncStorage instead of SQLite
- 🎨 Clean, modern UI
- 🛒 Shopping cart functionality
- 👤 User authentication
- 📦 Order management

## Quick Start

### Prerequisites

- Node.js 18+
- Android Studio (for Android builds)
- Java 17

### Installation

```bash
npm install
```

### Development

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run web version
npm run web
```

### Production Build

```bash
# Build optimized APK
./build-production.sh
```

The script will generate:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- Bundle: `android/app/build/outputs/bundle/release/app-release.aab`

## Optimizations Applied

### Bundle Size Reduction
- Removed Expo dependencies
- Replaced SQLite with AsyncStorage
- Removed unused libraries (reanimated, etc.)
- Optimized asset bundling

### Android Optimizations
- Enabled Hermes JS engine
- ProGuard minification
- Resource shrinking
- PNG crunching
- R8 full mode optimization
