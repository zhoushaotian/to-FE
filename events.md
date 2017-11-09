# node中的events模块
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


