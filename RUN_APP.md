# How to Run the React Native App

## Important: You have TWO Android projects

1. **`app/` directory** - This is a Jetpack Compose app (shows "Hello Android!") - **NOT the React Native app**
2. **`android/` directory** - This is the **React Native app** with the modern UI

## To run the React Native app with the modern UI:

### Step 1: Start Metro Bundler
```bash
npm start
```

### Step 2: Run the React Native app
In a NEW terminal window:
```bash
npm run android
```

OR if that doesn't work, run directly from the android directory:
```bash
cd android
.\gradlew installDebug
```

### Step 3: Make sure you're running the correct app
- The React Native app package name is: `com.example.civicaidmobile`
- The app should show a purple splash screen with "CivicAid" logo
- NOT the "Hello Android!" screen

## If you still see "Hello Android!":

1. Uninstall the old app from your device/emulator
2. Make sure Metro bundler is running
3. Run `npm run android` from the project root
4. The app should connect to Metro and show the React Native UI

## Troubleshooting:

If the app still doesn't load:
1. Check that Metro bundler is running on port 8081
2. Make sure your device/emulator can access localhost:8081
3. Try: `adb reverse tcp:8081 tcp:8081` to forward the port
4. Rebuild: `cd android && .\gradlew clean && cd .. && npm run android`

