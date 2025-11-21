module.exports = {
  expo: {
    name: "CivicAid",
    slug: "civicaid-mobile-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.example.civicaidmobile"
    },
    android: {
      package: "com.example.civicaidmobile",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        "projectId": "7e8847eb-50a0-4f3e-97d8-16f89d5d05d1"
      }
    },
    // Important: This project uses custom native code
    // It cannot run in Expo Go - use Development Build or React Native CLI
    plugins: [
      // Add any Expo plugins here if needed
    ]
  }
};

