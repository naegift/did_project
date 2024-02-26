const webpack = require("webpack");

module.exports = {
  webpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env),
      }),
    ],
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        zlib: require.resolve("browserify-zlib"),
        util: require.resolve("util/"),
        url: require.resolve("url/"),
        assert: require.resolve("assert/"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        os: require.resolve("os-browserify/browser"),
        crypto: require.resolve("crypto-browserify"),
      };
      return webpackConfig;
    },
  },
};
