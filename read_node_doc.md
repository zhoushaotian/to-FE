# node Module
node的模块遵从commonJs规范，提供require函数用来加载一个模块。在node中一个文件等于一个模块，在载入文件执行之前会将原模块的code进行包装:
```js
(function(exports, require, module, __filename, __dirname){
    //your module code
})
```
这种包装有两种好处:
1. 提供了module, exports, require等变量,看起来就好像这几个变量是全局的，实际上这几个变量只是函数的局部变量
2. 隔离了全局作用域，在模块中定义的变量不会污染到全局变量  
## 模块标识符 
载入一个模块需要调用require()方法，这个函数的参数就是模块标识符。在node中模块标识符分为三种:
1. core module  
核心模块是node自身提供的，这种模块的优先级最高.例如: path 模块
2. 以./ ../开头的自定义模块  
例如require('./a')
3. 不以./ ../开头的非核心模块  
例如通过npm安装的包: require('express');  
关于模块的查找算法     
(https://nodejs.org/dist/latest-v8.x/docs/api/modules.html#modules_all_together)  

## 主模块  
当一个文件是直接从node启动的,例如: node ./a.js 那么这个a文件会当做当前node进程的主模块，主模块和其他模块类似，只不过require.main会被赋值给modele,也就是说如果要判断某个模块是否是主模块可以通过:
```js
console.log(module === require.main);
// true
// 整个应用的入口文件也可以通过require.main拿到
console.log('入口文件路径', require.main.filename);
```  
## 模块的循环引用问题 
当a模块require b模块,同时b模块require a模块的时候，会出现模块循环引用的问题，为了避免这种死循环，当出现循环引用的时候，require会直接返回还未完全赋值的module.exports
## [api](https://nodejs.org/dist/latest-v8.x/docs/api/modules.html#modules_the_module_scope)
# node Events
events模块是node中非常核心的一个模块，很多模块的实现都是基于这个模块(事件驱动的异步编程模式)。events模块对外暴露了一个类: Class EventEmitter.这个类实例的on方法可以注册一个事件的Listener,允许多个函数注册到同一个事件上.
- 当eventEmitter emit一个事件之后 所有注册到这个事件上的函数会按注册的顺序**同步的**依次被调用,使用同步的方式去调用所有的Listener主要是为了避免一些竞争条件,可以使用process.nextTick或者setImmediate去异步调用:
```js
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```
- newListener see [api](https://nodejs.org/dist/latest-v8.x/docs/api/events.html#events_event_newlistener)


