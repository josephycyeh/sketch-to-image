module.exports = {
  presets: [
    '@react-native/babel-preset',
    '@babel/preset-typescript',
  ],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: ['API_KEY', 'URL'],
        safe: true,
        allowUndefined: false,
      },
    ],
  ],
};