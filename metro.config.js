const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

// Use Expo's default config if available, otherwise use React Native's
let defaultConfig;
try {
  const {getDefaultConfig: getExpoDefaultConfig} = require('expo/metro-config');
  defaultConfig = getExpoDefaultConfig(__dirname);
} catch (e) {
  // Expo not available, use React Native's default config
  defaultConfig = getDefaultConfig(__dirname);
}

module.exports = mergeConfig(defaultConfig, config);


