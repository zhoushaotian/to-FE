const path = require('path');


module.exports = {
    entry: {
        'app': path.resolve(__dirname, '../src/app.jsx'),
    },
    output: {
        path: path.resolve(__dirname, '../dist/'),
        filename: 'app.[hash].min.js',
        chunkFilename: 'chunk.[name].[hash].min.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-react']
                }
            },
            
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            automaticNameDelimiter: '.',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 1
                }
            },
            name: 'vendors'
        },
        runtimeChunk: {
            name: entrypoint => `manifest.${entrypoint.name}`
        }
    },
    
};