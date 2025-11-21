# Expo Setup Guide

This app now supports both **Android Studio (React Native CLI)** and **Expo** development workflows.

## Quick Start

### Install Dependencies

First, install the new Expo dependencies:

```bash
npm install
```

This will install:
- `expo` - Expo SDK
- `expo-constants` - Access to app constants
- `expo-status-bar` - Status bar component
- `babel-preset-expo` - Babel preset for Expo

## Development Workflows

### Option 1: React Native CLI (Android Studio)

Use this for native Android development and debugging:

```bash
# Start Metro bundler
npm start

# Run on Android (in another terminal)
npm run android
```

You can also open the project in Android Studio:
1. Open Android Studio
2. Open the `android` folder
3. Build and run from Android Studio

### Option 2: Expo CLI

Use this for faster development and testing:

```bash
# Start Expo development server
npm run expo:start

# Or start directly for Android
npm run expo:android

# Or start directly for iOS (Mac only)
npm run expo:ios

# Or start for web
npm run expo:web
```

## Configuration Files

The app uses Expo's "bare workflow" which means:

- ✅ You have full access to native code
- ✅ You can use Android Studio for native development
- ✅ You can use Expo CLI for faster iteration
- ✅ All your existing native modules work
- ✅ You can build with either workflow

### Key Files:

- `app.config.js` - Expo configuration (for Expo tools)
- `app.json` - React Native configuration (for React Native CLI)
- `babel.config.js` - Uses `babel-preset-expo` (compatible with both)
- `metro.config.js` - Automatically uses Expo config if available

## Building

### With React Native CLI:

```bash
cd android
./gradlew assembleRelease
```

### With Expo:

```bash
# Install Expo CLI globally (if not already installed)
npm install -g expo-cli

# Build with Expo
expo build:android
# or use EAS Build (recommended)
eas build --platform android
```

## Notes

- Both workflows can be used interchangeably
- The app maintains full native code access
- All existing features continue to work
- You can switch between workflows at any time

## Troubleshooting

### If Expo commands don't work:

1. Make sure you've run `npm install` to install Expo dependencies
2. Check that `expo` is listed in your `package.json` dependencies
3. Try clearing cache: `expo start -c`

### If React Native CLI doesn't work:

1. Make sure Metro bundler is running: `npm start`
2. Check Android SDK is properly configured
3. Clean build: `cd android && ./gradlew clean && cd ..`

