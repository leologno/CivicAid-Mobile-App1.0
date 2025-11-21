# Android Device/Emulator Setup Guide

## Current Status
- ✅ Android SDK found at: `C:\Users\Logno\AppData\Local\Android\Sdk`
- ❌ No Android devices connected
- ❌ No Android emulators available

## Option 1: Use Expo Go App (Easiest - Recommended)

This is the fastest way to test your app without setting up an emulator:

1. **Install Expo Go on your Android phone:**
   - Download from Google Play Store: [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start Expo development server:**
   ```bash
   npm run expo:start
   ```

3. **Connect your phone:**
   - Make sure your phone and computer are on the same WiFi network
   - Scan the QR code shown in the terminal with:
     - **Android**: Use the Expo Go app to scan the QR code
     - Or enter the URL manually in Expo Go

## Option 2: Create Android Emulator (Android Studio)

1. **Open Android Studio**

2. **Open AVD Manager:**
   - Click "More Actions" → "Virtual Device Manager"
   - Or Tools → Device Manager

3. **Create a new virtual device:**
   - Click "Create Device"
   - Select a device (e.g., Pixel 5)
   - Select a system image (e.g., API 33 or 34)
   - Click "Finish"

4. **Start the emulator:**
   - Click the ▶️ play button next to your emulator
   - Wait for it to boot up

5. **Run the app:**
   ```bash
   npm run expo:android
   ```

## Option 3: Use Physical Android Device

1. **Enable Developer Options on your phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect your phone via USB**

3. **Verify connection:**
   ```bash
   adb devices
   ```
   You should see your device listed

4. **Run the app:**
   ```bash
   npm run expo:android
   ```

## Option 4: Use Web Browser (Quick Testing)

For quick testing without a device:

```bash
npm run expo:web
```

This will open the app in your web browser. Note: Some native features may not work in web mode.

## Setting Up Environment Variables (Optional)

To make `adb` and `emulator` commands available globally, add to your system PATH:

1. **Windows:**
   - Open System Properties → Environment Variables
   - Add to PATH:
     - `C:\Users\Logno\AppData\Local\Android\Sdk\platform-tools`
     - `C:\Users\Logno\AppData\Local\Android\Sdk\emulator`

2. **Or set ANDROID_HOME:**
   - Variable: `ANDROID_HOME`
   - Value: `C:\Users\Logno\AppData\Local\Android\Sdk`

## Quick Commands

```bash
# Start Expo dev server (then scan QR code with Expo Go)
npm run expo:start

# Start for Android (requires emulator or device)
npm run expo:android

# Start for web browser
npm run expo:web

# Check connected devices
adb devices

# List available emulators
emulator -list-avds
```

## Troubleshooting

### "adb: command not found"
- Add Android SDK platform-tools to your PATH (see above)

### "No devices found"
- Make sure emulator is running OR
- Physical device is connected with USB debugging enabled

### Expo Go can't connect / Shows "Failed to download remote update"
**IMPORTANT:** This project uses custom native code and **cannot run in Expo Go**. 

The project has:
- Custom Android native code (`android/` folder)
- Native modules: `react-native-image-picker`, `react-native-permissions`, `react-native-geolocation-service`

**Solutions:**
1. **Use React Native CLI instead** (Recommended):
   ```bash
   npm start
   # In another terminal:
   npm run android
   ```

2. **Use Expo Development Build** (if you need Expo features):
   - See `EXPO_GO_TROUBLESHOOTING.md` for detailed instructions
   - Requires building a custom development build with EAS

3. **Network troubleshooting** (if trying Expo anyway):
   - Ensure phone and computer are on the same WiFi
   - Try using tunnel mode: `npm run expo:start -- --tunnel`
   - Clear cache: `npx expo start --clear`

**See `EXPO_GO_TROUBLESHOOTING.md` for complete troubleshooting guide.**

