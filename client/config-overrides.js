const webpack = require('webpack');

module.exports = function override(config, env) {
  // Modern Webpack configuration for node polyfills
  
  // Remove the incompatible node configuration
  config.node = {
    __dirname: false,
    __filename: false,
    global: true
  };
  
  // Add fallback for node polyfills
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      "process": require.resolve("process/browser"),
      "buffer": require.resolve("buffer"),
      "util": require.resolve("util"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "assert": require.resolve("assert"),
      "url": require.resolve("url"),
      "os": require.resolve("os-browserify/browser")
    }
  };
  
  // Add process as a global using ProvidePlugin
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  );
  
  // Memory optimization for production builds
  if (env === 'production') {
    // Disable source maps to save memory
    config.devtool = false;
    
    // Split chunks for better memory usage
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        maxSize: 250000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    };
  }
  
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
