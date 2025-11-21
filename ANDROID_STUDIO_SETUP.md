# Android Studio Setup Guide

This guide will help you open and run the CivicAid app in Android Studio.

## Prerequisites

✅ **Already Configured:**
- Android SDK: `C:\Users\Logno\AppData\Local\Android\Sdk`
- Android Studio JDK: `C:\Program Files\Android\Android Studio\jbr` (Java 21)
- Emulator: Pixel_9 available
- Gradle wrapper files: Copied to `android/` directory

## Step-by-Step Instructions

### 1. Open Project in Android Studio

1. **Launch Android Studio**

2. **Open the Project:**
   - Click **File** → **Open**
   - Navigate to: `D:\CivicAID_Mobile_APP\android`
   - **Important:** Select the `android` folder, NOT the root project folder
   - Click **OK**

3. **Wait for Gradle Sync:**
   - Android Studio will automatically detect the project
   - It will start syncing Gradle dependencies
   - This may take a few minutes the first time
   - You'll see "Gradle sync in progress" at the bottom

### 2. Configure SDK (if needed)

1. **Check SDK Location:**
   - Go to **File** → **Project Structure** (or press `Ctrl+Alt+Shift+S`)
   - Click **SDK Location** in the left panel
   - Verify:
     - **Android SDK location:** `C:\Users\Logno\AppData\Local\Android\Sdk`
     - **JDK location:** `C:\Program Files\Android\Android Studio\jbr`
   - Click **OK**

### 3. Start the Emulator

**Option A: From Android Studio**
1. Click the **Device Manager** icon in the toolbar (or **Tools** → **Device Manager**)
2. Find **Pixel_9** in the list
3. Click the **▶️ Play** button next to it
4. Wait for the emulator to boot (this may take 1-2 minutes)

**Option B: From Command Line**
```powershell
cd D:\CivicAID_Mobile_APP
$env:ANDROID_HOME = "C:\Users\Logno\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\emulator"
emulator -avd Pixel_9
```

### 4. Start Metro Bundler

**In a separate terminal/command prompt:**
```bash
cd D:\CivicAID_Mobile_APP
npm start
```

Keep this terminal running - it's the JavaScript bundler.

### 5. Run the App

**In Android Studio:**

1. **Select Run Configuration:**
   - At the top toolbar, you should see "app" in the run configuration dropdown
   - If not, click the dropdown and select **app**

2. **Select Device:**
   - Click the device dropdown (next to the run button)
   - Select **Pixel_9** (or your running emulator)

3. **Run:**
   - Click the green **▶️ Run** button (or press `Shift+F10`)
   - Or go to **Run** → **Run 'app'**

4. **Wait for Build:**
   - Android Studio will build the app (first build may take 5-10 minutes)
   - You'll see build progress in the bottom status bar
   - The app will automatically install and launch on the emulator

## Troubleshooting

### Gradle Sync Fails

If you see Gradle sync errors:

1. **Invalidate Caches:**
   - Go to **File** → **Invalidate Caches...**
   - Check all boxes
   - Click **Invalidate and Restart**

2. **Clean Build:**
   - Go to **Build** → **Clean Project**
   - Then **Build** → **Rebuild Project**

### Emulator Not Showing

1. **Check if emulator is running:**
   ```powershell
   adb devices
   ```
   You should see `emulator-5554    device`

2. **Restart ADB:**
   ```powershell
   adb kill-server
   adb start-server
   ```

### Metro Bundler Connection Issues

1. **Check Metro is running:**
   - Should see "Metro waiting on port 8081"

2. **Restart Metro:**
   - Stop Metro (Ctrl+C)
   - Clear cache: `npm start -- --reset-cache`

3. **Check emulator can reach Metro:**
   ```powershell
   adb reverse tcp:8081 tcp:8081
   ```

### Build Errors

If you encounter build errors:

1. **Check Java Version:**
   - Android Studio should use its bundled JDK automatically
   - Verify in **File** → **Project Structure** → **SDK Location**

2. **Update Gradle (if needed):**
   - Android Studio will prompt you to update Gradle if needed
   - Click "Update" when prompted

3. **Check Android SDK:**
   - Go to **Tools** → **SDK Manager**
   - Ensure Android SDK Platform 34 is installed
   - Ensure Android SDK Build-Tools 34.0.0 is installed

## Quick Reference

### Run Commands in Android Studio

- **Run App:** `Shift+F10` or click ▶️ Run button
- **Debug App:** `Shift+F9` or click 🐛 Debug button
- **Stop App:** `Ctrl+F2` or click ⏹️ Stop button

### Useful Android Studio Shortcuts

- **Open Project Structure:** `Ctrl+Alt+Shift+S`
- **Open Settings:** `Ctrl+Alt+S`
- **Build Project:** `Ctrl+F9`
- **Rebuild Project:** `Ctrl+Shift+F9`
- **Sync Project with Gradle Files:** Click the 🔄 icon in toolbar

## Alternative: Use React Native CLI

If Android Studio has issues, you can also use React Native CLI:

```bash
# Terminal 1: Start Metro
cd D:\CivicAID_Mobile_APP
npm start

# Terminal 2: Run on Android
npm run android
```

**Note:** The React Native CLI approach may have Gradle compatibility issues. Android Studio handles these automatically.

## Why Android Studio is Recommended

Android Studio:
- ✅ Automatically handles Gradle and Kotlin version compatibility
- ✅ Uses the correct JDK version
- ✅ Provides better error messages and debugging
- ✅ Has integrated emulator management
- ✅ Better build performance with caching
- ✅ Integrated debugging tools

## Next Steps

Once the app is running:
- You can make code changes and see them with Fast Refresh
- Use Android Studio's debugger to set breakpoints
- View logs in the Logcat window
- Use the Layout Inspector to debug UI issues

