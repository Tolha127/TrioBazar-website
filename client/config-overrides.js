export default function override(config) {
  // Add polyfills and fallbacks for node built-in modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "assert": require.resolve("assert/"),
    "crypto": require.resolve("crypto-browserify"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "stream": require.resolve("stream-browserify"),
    "url": require.resolve("url/"),
    "util": require.resolve("util/"),
    "zlib": require.resolve("browserify-zlib"),
    "buffer": require.resolve("buffer/"),
    "process": require.resolve("process/browser")
  };

  return config;
};
