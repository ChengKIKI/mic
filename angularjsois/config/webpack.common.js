
const webpack = require('webpack');
const helpers = require('./helpers');

const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

/**
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
    title: '',
    baseUrl: '/',
    isDevServer: helpers.isWebpackDevServer(),
    HMR: HMR
};
module.exports = function (options) {
    isProd = options.env === 'production';
    return {
        // entry: {

            // 'polyfills': './src/polyfills.main.js',
            // 'main':  './src/app.module.js'

        // },
        // entry: ["babel-polyfill", "./src/app.module.js"],
        resolve: {
            extensions: ['.js', '.json'],
            modules: [helpers.root('src'), helpers.root('node_modules')],

        },
        module: {

            rules: [

                {
                    test: /\.js$/,
                    exclude:  [helpers.root('node_modules')],
                    include:  [helpers.root('src')],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['babel-preset-env']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['to-string-loader', 'css-loader'],
                    exclude: [helpers.root('src', 'styles')]
                },
                {
                    test: /\.scss$/,
                    use: ['to-string-loader', 'css-loader', 'sass-loader'],
                    exclude: [helpers.root('src', 'styles')]
                },
                {
                    test: /\.html$/,
                    use: 'raw-loader',
                    exclude: [helpers.root('src/index.html')]
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                    use: 'file-loader'
                }

            ],

        },
        plugins: [
            new CheckerPlugin(),
            new CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills']
            }),
            // new CopyWebpackPlugin([{from: 'src/assets', to: 'assets'}]),

            new ProvidePlugin({
                // ...
                $: "jquery",
                jQuery: "jquery",
                'window.jQuery': "jquery",
                // add this:
            }),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                title: METADATA.title,
                chunksSortMode: 'dependency',
                metadata: METADATA,
                inject: 'body'
            }),
            new ScriptExtHtmlWebpackPlugin({
                sync: /polyfills|vendor/,
                defaultAttribute: 'async',
                preload: [/polyfills|vendor|main/],
                prefetch: [/chunk/]
            }),
            new HtmlElementsPlugin({
                headTags: require('./head-config.common')
            }),
            new LoaderOptionsPlugin({}),
            new InlineManifestWebpackPlugin(),
        ],
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }

    };
}
