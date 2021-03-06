const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliGzipPlugin = require('brotli-gzip-webpack-plugin');
const ServiceWorkerWepbackPlugin = require('serviceworker-webpack-plugin');
const path = require('path');

exports.loaderOptions = new webpack.LoaderOptionsPlugin({
  options: {
    context: __dirname,
  },
});

exports.environmentVariables = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  },
});

// exports.uglifyJs = new webpack.optimize.UglifyJsPlugin({
//   output: {
//     comments: false,
//   },
//   compress: {
//     warnings: false,
//     drop_console: true,
//   },
// });

exports.extractText = (() => {
  const config = {
    filename: 'style.css',
  };
  return new ExtractTextPlugin(config);
})();

exports.manifest = new ManifestPlugin({
  fileName: 'asset-manifest.json',
});

exports.Gzip = new CompressionPlugin({
  asset: '[path].gz[query]',
  algorithm: 'gzip',
  test: /\.js$|\.css$|\.html$/,
  threshold: 5240,
  minRatio: 0.8,
});

exports.brotliGzip = new BrotliGzipPlugin({
  asset: '[path].gz[query]',
  algorithm: 'gzip',
  test: /\.js$|\.css$/,
  // threshold: 10240,
  minRatio: 0.8,
});

exports.sw = new ServiceWorkerWepbackPlugin({
  entry: path.join(__dirname, 'public/sw.js'),
});

// exports.sw = new SWPrecacheWebpackPlugin({
//   // By default, a cache-busting query parameter is appended to requests
//   // used to populate the caches, to ensure the responses are fresh.
//   // If a URL is already hashed by Webpack, then there is no concern
//   // about it being stale, and the cache-busting can be skipped.
//   dontCacheBustUrlsMatching: /\.\w{8}\./,
//   filename: 'service-worker.js',
//   logger(message) {
//     if (message.indexOf('Total precache size is') === 0) {
//       // This message occurs for every build and is a bit too noisy.
//       return;
//     }
//     console.log(message);
//   },
//   minify: true,
//   navigateFallback: '/index.html',
//   staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
// });

exports.copy = new CopyWebpackPlugin([
  { from: 'public' },
]);
