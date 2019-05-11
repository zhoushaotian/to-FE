const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    module: {
        rules: [
            {
                test: /\.(less|css)$/,
                use: [ {
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader',
                    options: {
                        javascriptEnabled: true
                    }
                }]
            }
        ]
    },
    devServer: {
        hot: true,
        inline: true,
        compress: true,
        port: 9000,
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: '/index.html' },
            ],
        },
        quiet: true,
        host: '0.0.0.0',
        proxy: {
            '/do': {
                target: 'http://192.168.14.199/php-ipr-qlcy-web/',
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            templateParameters: {
                noOtherCdn: true
            }
        }),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: ['Your application is running here: http://localhost:9000'],
            },
        }),
        
    ]
});