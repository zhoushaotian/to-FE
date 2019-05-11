# webpack4配置指北
## mode
使用不同的mode会开启webpack的默认配置,例如在devlopment mode下,webpack会向文件中注入环境变量 process.env.NODE_DEV = 'devlopment'
## 热重载
当改变代码的时候，页面并不是直接刷新，而是替换掉改变的那部分代码，而不丢失掉页面状态。这在开发中十分有用，当我们开发一个表单的时候，我们只改变了其中的一部分样式，这个时候如果直接刷新页面，那填写的一些信息会丢失，开启热重载之后，页面不会刷新，只会重载改变的那部分。
我们使用HotModuleReplacementPlugin来开启代码热重载。
1. css
在开发配置中，css样式需要内联,在生产配置中再将css抽离出为css文件
```js
// loader
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
// plugins
plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
    }),
    new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
            messages: ['Your application is running here: http://localhost:9000'],
        },
    }),
    
]
```
2. react应用热重载
使用react-hot-loader可以使得我们的react的应用局部刷新，而不丢失之前的状态。  
需要配置babel以及修改组件导出方式
```js
// babel
{
    "presets": [["@babel/preset-env", {
        "useBuiltIns": "usage",
        "corejs": "3.0.0"
    }]],
    "plugins": ["@babel/plugin-proposal-class-properties", ["import", {
        "libraryName": "antd",
        "style": true
    }], "@babel/plugin-syntax-dynamic-import", "react-hot-loader/babel"] // 添加react-hot-loader
}
// 组件导出
import { hot } from 'react-hot-loader/root';
import React from 'react';

function App() {
    return <div>1</div>
}
export default hot(App);
```
另外，如果用到了react16的hooks，需要修改reactDom的引用,在开发配置中
```js
resolve: {
    alias: {
        'react-dom': '@hot-loader/react-dom'
    }
},
```
## dev-server
dev server
```js
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
    host: '0.0.0.0', // 监听0.0.0.0而不是监听本地地址，这样可以使得局域网中的所有机器都可以访问
    proxy: {
        '/do': {
            target: 'http://192.168.14.199/php-ipr-qlcy-web/',
        }
    }
}
```
## common-chunk
对于一些公共库我们可以将代码单独抽离出来为一个chunk，这样在加载的时候可以充分利用并发。
分为以下两种chunk
1. runtime的chunk例如es6的一些垫片,webpack的一些工具方法
2. nodemodule中引入的库  
```js
optimization: {
    splitChunks: {
        chunks: 'async', // 异步加载chunk
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
```
## 按需加载
使用@babel/plugin-syntax-dynamic-import，@loadable/component来进行异步加载
```js
// babel配置加入@babel/plugin-syntax-dynamic-import
// router

import React from 'react';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import { LocaleProvider } from 'antd';
import loadable from '@loadable/component';


import zhCN from 'antd/lib/locale-provider/zh_CN';
function Routes() {
    return (
        <LocaleProvider locale={zhCN}>
            <Router>
                <Route exact={true} component={loadable(() => import('./main.jsx'))} path="/filter"/>
                <Route exact={true} component={loadable(() => import('./page/demo'))} path="/demo"/>
            </Router>
        </LocaleProvider>
    );
}
export default Routes;
```
## css分离
在webpack中使用mini-css-extract-plugin来分离css
```
new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
}),
```
## 可视化分析打包
使用webpack-bundle-analyzer
```js
new BundleAnalyzerPlugin({ analyzerPort: 8919 }), // 会在8919端口上提供一个页面进行可视化分析
```
## 基础包cdn加载
使用webpack-cdn-plugin可以在html-webpack-plugin的基础上配置化加载的cdn
```js
new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true
}),
new WebpackCdnPlugin({
    modules: [
        {
            name: 'react', // 对应node_modules中的名称
            var: 'React',// 对应使用的变量名
            path: 'umd/react.production.min.js' // cdn路径
        },
        {
            name: 'react-dom',
            var: 'ReactDOM',
            path: 'umd/react-dom.production.min.js'
        }
    ]
}),
```
## 清包
使用clean-webpack-plugin

