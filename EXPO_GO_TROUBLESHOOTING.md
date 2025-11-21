# Expo Go Error Troubleshooting Guide

## Understanding the Error

The errors you're seeing:
- **"Failed to download remote update"** - Expo Go cannot download/load your app
- **"Something went wrong"** - Generic Expo error screen

## Root Cause

**Your project cannot run in Expo Go** because it uses:
- ✅ Custom native Android code (`android/` folder exists)
- ✅ Native modules that require custom native code:
  - `react-native-image-picker`
  - `react-native-permissions`
  - `react-native-geolocation-service`
  - `@react-native-picker/picker`

**Expo Go only supports the "managed workflow"** - apps without custom native code. Since your project has been prebuilt with native code, you need a different approach.

## Solutions

### ✅ Solution 1: Use Expo Development Build (Recommended)

This is the modern way to use Expo with custom native code:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure EAS:**
   ```bash
   eas build:configure
   ```

4. **Build a development build for Android:**
   ```bash
   eas build --profile development --platform android
   ```

5. **Install the development build on your device:**
   - Download the APK from the EAS build page
   - Install it on your Android device
   - This replaces Expo Go with your custom development build

6. **Start the development server:**
   ```bash
   npm run expo:start
   ```

7. **Connect your device:**
   - Scan the QR code with your development build (not Expo Go)
   - Or use tunnel mode: `npm run expo:start -- --tunnel`

### ✅ Solution 2: Use React Native CLI (Easiest for Now)

Since you already have the Android native code set up:

1. **Start Metro bundler:**
   ```bash
   npm start
   ```

2. **In another terminal, run on Android:**
   ```bash
   npm run android
   ```
   Or if you have a device connected:
   ```bash
   npx react-native run-android
   ```

3. **Make sure:**
   - Android emulator is running, OR
   - Physical device is connected with USB debugging enabled
   - Check with: `adb devices`

### ✅ Solution 3: Network Troubleshooting (If using Expo)

If you want to try Expo Go anyway (though it won't work with your native modules), fix network issues:

1. **Ensure same WiFi network:**
   - Phone and computer must be on the same WiFi
   - Some corporate/public WiFi blocks device-to-device communication

2. **Use tunnel mode:**
   ```bash
   npm run expo:start -- --tunnel
   ```
   This uses Expo's servers to route traffic (slower but works across networks)

3. **Check firewall:**
   - Windows Firewall might be blocking Metro bundler
   - Allow Node.js through firewall

4. **Try LAN mode explicitly:**
   ```bash
   npm run expo:start -- --lan
   ```

5. **Clear Expo cache:**
   ```bash
   npx expo start --clear
   ```

6. **Check your IP address:**
   - Make sure the IP shown in Expo matches your computer's IP
   - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

### ✅ Solution 4: Use Web Version (Quick Testing)

For quick testing without native features:

```bash
npm run expo:web
```

This opens in your browser. Note: Native features like camera, location won't work.

## Quick Fix Commands

```bash
# Clear all caches and restart
npx expo start --clear

# Start with tunnel (works across networks)
npm run expo:start -- --tunnel

# Start with LAN (same network only)
npm run expo:start -- --lan

# Use React Native CLI instead
npm start
# Then in another terminal:
npm run android
```

## Why This Happens

1. **Expo Go Limitations:**
   - Expo Go is a pre-built app with a fixed set of native modules
   - It cannot load apps with custom native code
   - Your project has native Android code, so it's incompatible

2. **Development Build vs Expo Go:**
   - **Expo Go**: Pre-built, limited native modules, quick testing
   - **Development Build**: Custom-built with your native code, full functionality

## Recommended Approach

For your project, I recommend:

1. **For development:** Use React Native CLI (`npm run android`)
2. **For testing on multiple devices:** Build an Expo Development Build
3. **For quick web testing:** Use `npm run expo:web`

## Next Steps

1. Try Solution 2 (React Native CLI) - it's the quickest
2. If you need Expo features, set up Solution 1 (Development Build)
3. Update your development workflow based on what works best

## Still Having Issues?

1. Check that Metro bundler is running
2. Verify Android emulator/device is connected: `adb devices`
3. Check the terminal for specific error messages
4. Try clearing all caches: `npm start -- --reset-cache`

