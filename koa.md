# koa初探
## 中间件
用惯了express的中间件处理方式之后初次上手koa会觉得koa的中间件机制有点难以理解。对于express的中间件来说，其中间件更符合常人的理解方式，它相当于是一条工作流水线，每个中间件像是流水线中的一个个工人节点，当请求进入的时候，会根据中间件定义的顺序，依次进入每个中间件。一个中间件处理完成之后进入下一个中间件。其间，只要调用了res.send等响应请求的方法，请求就会响应，之后再次调用响应请求的方法会无效，同时会抛错。调用next方法会使得请求进入下一个中间件。
koa的方式完全不同。在koa中，依托async异步函数，中间件遵循洋葱模型。在async中有协程的概念，调用await处理一个异步操作时候，控制流会首先转移到这个异步操作里，等到异步操作完成之后，控制流会重新回到调用await的地方，也就是回到主程，这正好切合了koa的洋葱模型。当请求到达第一个中间件的时候，我们的中间件函数使用async做异步处理，当此中间件的处理完毕之后，异步调用next使得请求到达下一个中间件，这里的next()其实会返回一个promise，刚好await需要接受一个promise。当接下来的所有中间件处理完毕之后，调用会重新回到第一次await的地方，当所有中间件处理完毕的时候，请求会返回，这个时候koa内部做了一些处理，如果返回的时候没有任何返回体，也就是没有任何返回数据，那么会自动将返回定为404，并抛给浏览器。
## koa-compose
koa-compose是一个合并原始回调函数的模块，它接受一个回调函数数组，然后返回一个函数，执行这个函数会返回一个promise，这个promise待所有的回调执行完成之后会resolve。
```js
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)  // 递归执行每一个回调，并将下一个回调当做next传入其中next返回一个promise
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```
## 响应
之前说到koa会自动处理返回的内容，其实是在respond函数中完成
```js
function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  const res = ctx.res;
  if (!ctx.writable) return;

  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    body = ctx.message || String(code);
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```