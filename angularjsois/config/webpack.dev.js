var path = require('path');
const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
// const webpackMergeDll = webpackMerge.strategy({plugins: 'replace'});
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const { names } = require('../package.json').name;
/**
 * Webpack Plugins
 */
//const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 7066;
const PUBLIC = process.env.PUBLIC_DEV || undefined;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
  host: HOST,
  port: PORT,
  public: PUBLIC,
  ENV: ENV,
  HMR: HMR
});


// const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;

module.exports = function (options) {
  return webpackMerge(commonConfig({env: ENV}), {
    entry: ["babel-polyfill", "./src/app.module.js"],
    // entry: "./src/app.module.js",
    devtool: 'inline-source-map',
    output: {
        
      path: helpers.root('dist'),
    //   path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
      publicPath: '/',
      sourceMapFilename: '[file].map',
      chunkFilename: '[name].chunk.js',
      

    //   library: 'ac_[name]',
    //   libraryTarget: 'var',
      // 把子应用打包成 umd 库格式
        library: `${names}-[name]`,
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${names}`,
    },

    module: {

      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          include: [helpers.root('src', 'styles')]
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          include: [helpers.root('src', 'styles')]
        },

      ]

    },

    plugins: [
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR,
        }
      }),
      new LoaderOptionsPlugin({
        debug: true,
        options: {

        }
      }),
    ],
    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      public: METADATA.public,
      historyApiFallback: true,
      watchOptions: {
        // if you're using Docker you may need this
        // aggregateTimeout: 300,
        // poll: 1000,
        ignored: /node_modules/
      },
      setup: function(app) {
        // For example, to define custom handlers for some paths:
        // app.get('/some/path', function(req, res) {
        //   res.json({ custom: 'response' });
        // });
      }
    },
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });
}
