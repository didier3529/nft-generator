const path = require('path');

module.exports = {
  // Empty configuration with no polyfills
  // This allows the app to use only browser APIs
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Handle polyfills for node modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
        console: require.resolve('console-browserify'),
        constants: require.resolve('constants-browserify'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        process: require.resolve('process/browser'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        util: require.resolve('util/'),
        zlib: require.resolve('browserify-zlib'),
      };
      
      return webpackConfig;
    },
  },
  jest: {
    configure: {
      // Use our jest.config.js for configuration
      ...require('./jest.config.js'),
      // Override/add any additional settings here
      transformIgnorePatterns: [
        '/node_modules/(?!(@solana|@project-serum|@coral-xyz))',
      ],
    },
  },
}; 