const webpack = require('webpack');

module.exports = function override(config, env) {
  // Simplified config with focus on process polyfill
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "process": require.resolve("process/browser"),
    "process/browser": require.resolve("process/browser"),
    
    // Keep other polyfills for compatibility
    "assert": require.resolve("assert/"),
    "crypto": require.resolve("crypto-browserify"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "stream": require.resolve("stream-browserify"),
    "url": require.resolve("url/"),
    "util": require.resolve("util/"),
    "zlib": require.resolve("browserify-zlib"),
    "buffer": require.resolve("buffer/")
  };

  // Add webpack plugins to provide process
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};

// Fix for webpack dev server deprecation warnings
module.exports.devServer = function(configFunction) {
  return function(proxy, allowedHost) {
    const config = configFunction(proxy, allowedHost);
    
    // Replace deprecated onBeforeSetupMiddleware and onAfterSetupMiddleware with setupMiddlewares
    delete config.onBeforeSetupMiddleware;
    delete config.onAfterSetupMiddleware;
    
    config.setupMiddlewares = (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Custom middleware can be added here if needed
      
      return middlewares;
    };
    
    return config;
  };
};
