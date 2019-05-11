Generator函数是ES6实现的一种异步编程方案。可以理解为一个状态机。函数可以暂停执行。直到调用下一个next方法。  
```js
function *gen() {
    yield 2;
    yield 3;
    yield 4;
    return 5;
}
const f = gen();
f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: 4, done: false}
f.next(); // {value: 5, done: true}
```
在函数内部的yield关键字是函数暂停执行的标志。当函数执行遇到yield表达式的时候会暂停执行并将yield后面的表达式的值作为对象value的返回值。当函数执行遇到return的时候函数执行完毕。  
这与遍历器的接口很接近，其实generator函数就是一个遍历器生成函数，可以直接将generator函数赋给对象的Symbol.iterator属性。  
yield表达式本身是没有返回值的，但是next方法可以传入参数，这个参数就是上一个yield的返回值:
```js
function *gen(){
    for(;true;) {
        let temp = yield 1;
        console.log(temp);
    }
}
let f = gen();
f.next();
f.next(); // undefined
f.next(); // undefined
f.next('next'); // next 
```
Generator函数还有throw方法用来抛出遍历器函数里面的错误，例如:
```js
function *gen() {
    try {
        yield 1;
    } catch(e) {
        console.log('内部捕获',e)
    }
}
let f = gen();
f.next();

try{
    f.throw(new Error('错误1'));
    throw new Error('错误2')；
}catch(e) {
    console.log('外部捕获', e);
}
```  
如果函数内部有catch语句块，那么调用throw方法抛出的错误会被函数内部捕获，反之，会被函数外部的catch捕获。另外调用throw方法后会顺带执行一次next方法.  
另外Generator函数还有return方法，这个方法会终结遍历函数，并以给定的值作为返回值. 
- Generator函数的上下文  
与普通函数的调用不同，普通函数在调用完毕之后才会退出调用栈。而Generator函数在一次调用next方法之后会暂时退出函数调用栈，即它会将自己内部的变量状态冻结，直到下次调用next方法  
- Generator函数的异步应用  
一个Generator函数就是一个状态机，里面可以包装多个状态。由于js的异步任务是由回调函数来完成，在promise还未实现之前，多个异步任务就会出现回调地狱(callbackhell)，代码可读性很差。promise的实现让回调函数不再嵌套，而是由then来传入，但是这样的包装还是可读性不够好。generator函数的出现让异步任务又有了一种新的包装方式。
```js
function *gen() {
    let dataA = yield readFile('./a.js');
    let dataB = yield readFile('./b.js');
    console.log(dataA.toString());
    console.log(dataB.toString());
}
```
上面的gen函数封装了两个异步操作，当执行gen函数之后会返回一个迭代器对象，调用这个对象的next方法开始执行异步操作，遇到yield即暂停执行，相当于将这个函数的执行权交由第一个异步操作。这样的方式称为协程。那么，如何将执行权交还gen函数呢。假定readFile函数返回一个promise对象，我们可以在这个promise对象的then方法中交还执行权。也就是当这个异步操作完成之后的回调中交还执行权继续下一个异步操作。
```js
let g = gen();
g.next().value.then(function(err, data) {
    if(err) {
        throw err
    }
    g.next(data).then(function(err, data) {
        if(err) {
            throw err
        }
        g.next(data)
    })
});
```
如上，每次调用next会返回一个promise对象，我们在then中传入回调，并在回调中再次调用next方法交还执行权。  
单纯的generator函数并没有多大改善，且流程管理十分不方便，需要不停调用next方法。  
- Thunk函数  
个人理解js里的Thunk函数与函数柯里化有点类似，即只接受一个回调函数作为参数的单参数函数。如果仔细看上部分对generator函数的包装可以发现，每次then传入的回调都是一样的，即每次都需要调用next方法去让函数继续执行。当Thunk函数与generator函数结合起来就会发挥很大的威力:
```js
function run(gen) {
    let g = gen();
    function next(err, data) {
        let res = g.next(data);
        if(res.done) return;
        res.value.next(next);
    }
    run()
}
function *test() {
    // 你的generator函数逻辑
}
run(test)
```
这样的generator执行器的前提是你的generator函数中yield后面必须是一个参数，即只接受一个回调参数的单参数函数。  
- 基于promise的自动执行  
```js
function run(gen) {
    let g = gen();
    function next(data) {
        let res = g.next(data);
        if(res.done) return res.value;
        res.value.then(function(data) {
            next(data);
        });
    }
    next();
}
```
- ES2017中的async函数  
es2017中提出的async函数其实就是generator函数的一个语法糖，将*换成了async，将yield换成了await。且在语言层面提供了自动执行器，不需要自己编写。最后async返回一个promise对象，可以在then中继续接下来的操作。
