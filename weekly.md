# 第一周  
## promise的使用  
promise是一个封装异步操作的容器对象。这个容器对象的状态不会受到外界影响，只有异步操作的结果可以决定这个状态。并且只能由pending变为resolve，或者由pending变为reject。一旦这个promise的状态发生了改变那么就不会再改变。与普通的回调函数不同的是，就算这个状态已经发生了改变，你之后再向这个对象添加回调函数也会立即得到这个结果。而普通的回调函数一旦错过这个事件，再去监听不会得到结果。  
promise进行的操作无法取消，而且如果不设置回调函数，内部抛出的错误不会反应到外部。且无法精准控制操作进行的状态。  
### 基本用法  
ES6中，Promise是一个构造函数，用来生成一个promise实例。构造函数的参数是一个普通函数，这个函数接受两个参数，一个是resolve，一个是reject，在函数体中可以调用resolve或者reject来改变这个promise的状态。（这两个参数是两个由JavaScript引擎提供的函数）例如:  
```javascript
let a = new Promise((resolve,reject) => {
    if(){//判断异步操作是否成功
        resolve() //异步操作成功
    }else {
        reject() //操作失败
    }
}).then(() => {
    console.log('状态变为resolve');
}).catch(() => {
    console.log('状态变为reject');
});
```  
实例生成之后可以用then方法指定这个promise操作成功或者失败的回调函数，但是一般用then指定操作成功的回调，用catch指定操作失败的回调。 then指定的回调函数参数是promise中调用resolve传入的参数。reject同理。  
由于then方法返回的也是一个promise实例，所以可以使用链式写法。如果then方法指定的回调函数返回值是一个promise那么下一个then方法会等到这个promise的状态变化之后才会执行。否则会按照顺序依次执行then方法中的回调。  
另外，promise中抛出的错误具有冒泡性质。前一个promise抛出的错误总是由下一个catch方法捕获，如果没有指定一个catch回调。那么错误不会被捕获也不会传递到外层代码。  
**如何并发执行异步操作**  
Promise.all()方法可以将多个Promise实例包装成一个实例，这个实例的状态又多个实例决定：只有这些实例的状态都变为resolve包装后的实例才会变成resolve，此时多个实例的返回值组成一个数组，传递给p的回调函数。只要这些实例有一个被reject那么包装后的实例就会变成reject，并且第一个被reject的实例的返回值传给p的回调。  
##  POST请求中body常见数据格式  
1. apilication/x-www-form-urlencoded  
浏览器原生的form表单，如果不指定 enctype属性。那么最终会以这种格式提交数据。提交的数据以key1=val1&key2=val2...的方式编码，其中键值都做了url转码。(URL转码指的是将需要转码的字符转为16进制，然后从右到左取4位，不足4位的直接处理，每两位做一位前面加上%，例如空格的 ascii码是32 十六进制是20 那么urlencode转码之后就是%20)  
2. multipart/form-data  
这种格式支持上传表单文件。首先会生成一个boundary用于分割不同的字段， content-type中指定了本次请求的数据格式和boundary。消息主体中每个字段都以--boundary开头换行之后是该字段的描述信息然后回车，最后是字段的具体内容(文本或者是二进制信息)，消息主体以--boundary--结束。  
3. aplication/json  
body里的数据是序列化之后的json字符串，json字符串支持比键值对复杂的结构化数据。
# 第二周  
## js中如何进行对象的深复制&&如何判断变量类型  
```javascript
//对于一个普通的数组，用splice就可以复制。例如:
let arr = [1,2,3];
let arr2 = arr.slice();
//注意 这种方法只能复制 数组元素是 原始数据类型的数组(String、Number、Boolean)
//如果一个对象有多层嵌套，例如：
let obj = [
    {
        a:1,
        b:2
    },
    {
        a:3,
        b:4
    }
];
//这个时候就需要进行对象的深复制了。由于是嵌套对象，首先想到的肯定是利用递归
function deepCopy(source,target) {
    target = target || {};
    for(let i in source) { 
       if(typeof source[i] === 'object') {
           if(source[i] === null){
               target[i] = null; 
           }else {
               if(source[i].constructor === Object) {
                   target[i] = {};
               } else {
                   target[i] = [];
               }
               deepCopy(source[i], target[i]);
           }
       }else {
           target[i] = source[i];
       }
    }
    return target;
}
//或者借助JSON，但是它能正确处理的是能够被JSON直接表示的数据结构:
function jsonClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
```
对于变量的类型判断：  
1. 利用typeof返回一个变量的类型，但是对于数组和对象无法判断，都是返回'object'
2. instanceof 测试一个对象的原型链中是否存在一个构造函数的prototype属性： obj instanceof constructor 例如  [] instanceof Array 返回 true []instanceof Obejct 也会返回true  
3. 利用toString方法：在JS中由于每个对象都继承自Object所以都会有一个toString方法，在Object构造函数的原型对象上的toString方法会返回一个字符串"[object type]"，type表示了调用该方法的对象的类型。   
```javascript
function isType(type) {
    return function(obj) {
        if(toString.call(obj) === `[object ${type}]`) return true
        return false;
    };
}
```
上面这个函数是一个工厂函数，根据传入的type值可以产生判断不同变量类型的函数。是一种偏函数的用法(传入不同的参数值 调用相同函数 产生部分参数值已经固定的函数 不同函数 的函数)。例如:  
```javascript
let isArray = isType('Array');
isArray([]); //true
let isObject = isType('Object');
isObject({}); //return true
isObject([]); //return false
```  
注意：只有Object原型对象上的toString方法才会返回表示对象类型的字符串。
## 对中文名的排序  
-  localeCompare函数  
用法: referenceStr.localeCompare(compareStr, locales).其中compareStr是待比较的字符串,locales参数指定了要比较的语言。例如'zh','de','sv'.函数会根据指定的语言比较两个字符串，当引用字符串在比较字符串前面时则返回负值，在后面则返回正值，顺序相同返回0.
## 页面需要用到的权限信息如何在node层传出  
通常页面路由的时候，根据权限的设定，在res.render的时候向模板传递一个字段表示该用户的权限信息，然后在模板中将这个字段绑定到一个dom对象中，这样页面渲染完成之后就可以通过dom的这个自定义属性在前端拿到该用户的权限信息。
## TCP协议  

## 再探HTTP  
## webpack 配置sourcemap  
## node process对象   
# 第三周  
## Vue响应式原理  
1. Vue如何追踪每个属性的变化  
Vue实例在初始化的时候，会把data对象里面的每个属性通过Object.defineProperty转换成getter和setter。关于Object.defineProperty:
Object.defineProperty可以定义或者修改一个对象上的属性，并返回这个对象。defineProperty与直接添加一个属性不同的是，他可以指定这个属性的描述符。一个属性的描述符分为两种，一种是数据描述符，另外一种是存取描述符。defineProperty指定的描述符只能是其中一种。两种描述符都具有以下属性:  
- configurable: 当且仅当这个描述符为true的时候这个对象的属性描述符才能被改变，该属性也能从对象中删除，默认为false  
- enumerable： 决定这个属性是否可以枚举，默认为false  
- value: 属性对应的值 默认是undefined  
- writable：当且仅当该属性的 writable为true时，该属性才能被赋值运算符改变。 默认为false  
存取描述符还有以下属性:  
-get: 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined。  
-set: 一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined。  
Vue通过getter和setter来追踪依赖，在属性被访问和被修改的时候通知变化。  
2. 变化检测  
每个Vue实例都有一个watcher对象，在组件渲染的过程中把属性记录为依赖，当属性的setter被调用的时候，会通知watcher重新计算，从而使组件更新。这也是为什么Vue不允许动态添加根级响应式属性的原因，因为在实例化的时候就已经把所有属性转化成getter与setter了，之后添加的根级属性不是响应式的。不过可以调用Vue.set方法来添加一个新的属性。另外，如果向已经存在的对象添加一个属性，例如:
```JavaScript
new Vue({
    data: {
        a: 1,
        b: {
            c: 1
        }
    }
})
```  
向对象b添加一个新属性不会触发更新，这个时候可以使用Object.assign方法创建一个新的对象包含已有对象的属性和新添加的属性然后再赋值给b。  
3. 异步更新队列  
在Vue中dom的更新是异步的，也就是说，当你改变一个响应式的属性值的时候，Vue不会马上去更新dom，而是将这个改变事件推入一个队列中，缓冲在同一次事件循环中发生的所有数据改变(例如一个属性值多次被改变，那么只会取最后一次改变的结果)，如果在一次事件循环里有同一个watcher多次被触发，那么只会一次推入到队列中。然后在下一次事件循环中，Vue刷新这个队列，并执行实际需要改变的操作。  
如果你需要在dom更新之后执行一些操作。例如：一个函数依赖于dom的一些属性才能正常运行。当你改变一个数据的时候，dom不会马上更新，也就是说这个函数拿到的dom属性不是改变之后的，这个时候，你需要用到Vue.nextTick(callback)，这个函数会在dom更新之后执行参数中的回调，并且回调中的this自动绑定到当前vue实例上。  

## webpack基本原理
## commonJS、AMD、CMD、es6模块规范  
- 异步加载： AMD、CMD  
AMD、CMD与commonJS的最大区别在于前者是异步加载，后者为同步加载. 
--- 
1. AMD  
- 使用AMD定义一个模块:  
```javascript
//定义一个math模块，AMD规定一个JS文件就是
//math.js  
define(['a'], function(a){
    function add(){
        a.one();
    }
    return {
        add
    }
});
```  
define函数的第一个参数是定义模块所依赖的其他模块。第二个参数是回调函数，在依赖模块加载完成之后会执行这个函数，回调函数返回的对象是导出的接口。  
- 模块的加载  
使用require函数加载其他模块，需要再之前引入requirejs：  
```html
<script src="js/require.js"></script>  
<script src="js/main"></script>
```  
main.js是自己代码的入口文件称为主模块,所有的代码都从这里开始运行。  
```javascript
// main.js
require(['aModule','bModule'], function(a,b){
    // your code
})
```  
require函数也接收两个参数,第一个参数是代码依赖的所有模块，第二个参数是回调函数，当所有模块加载完成之后会执行这个回调函数。加载的模块会以参数的形式传入回调函数.默认情况下，加载的模块都被认为是和main.js在一个目录下。如果要加载其他目录的模块，可以在开头使用require.config配置  
```javascript
require.config({
    path: {
        "amodule": 'src/amodule'
    }
});
//或者直接改变基准目录
require.config({
    baseUrl: 'src/',
    path: {
        "amodule": 'amodule'
    }
})  

--- 
- 同步加载： commonJS
## 虚拟dom与diff算法  
## 详解JavaScript单线程与事件循环（浏览器环境与node环境）
JavaScript一开始设计的时候只是浏览器端的脚本，只有一些dom的相关操作不需要复杂的数据处理，所以没有涉及多线程的概念，倘若加入了多线程，当线程a改变了dom的数据，线程b也改变了dom的数据，那么还需要考虑线程之间的通信与线程锁，无疑让语言变得更复杂。而且ECMA中也没有提到线程的概念。  
JavaScript单线程指的是其执行线程只有一个，即所有javascript代码的执行只在一个主线程中。另外的一些异步操作的执行会因为环境的不同而不同。这里因为涉及到异步操作并且js又是单线程的，所以又引出了js另外一个特性：事件驱动。
- 这种既是单线程又是异步的语言有个共同特点，就是事件驱动。  
js的执行进程(主进程)其实就是一个事件循环(eventloop)的进程。当一个JS文件运行的时候就已经进入了第一个事件循环，这个时候会运行第一个事件的回调函数。而所有回调函数的执行都是在这个进程之中。  
每轮事件循环都会从任务队列中取出事件来执行其对应的回调函数。每当调用一个异步API的时候(例如setTimeout)会向事件队列中push一个事件，在浏览器环境中存在两类任务队列（多个任务队列）每个任务源对应一个任务队列。  
1. 宏任务(macro task)  
宏任务队列也叫任务队列，一次事件循环可能有一个或者多个宏任务队列，又不同的任务源产生，在一次事件循环开始之后，首先会从一个宏任务队列中取出`一个`任务到执行栈执行。而在这个任务队列执行过程中可能又会有异步API调用，这个时候如果产生的任务是宏任务那么会等到下一次tick再执行，如果是微任务那么就会在当前tick执行。  
2. 微任务(micro task)  
当这次事件循环的宏任务`队列`执行完毕后，会执行当前循环中所有的微任务。同队列的顺序，先进入微任务队列的任务会先执行。所有微任务执行完成后进入下一轮事件循环。即当微任务队列为空的时候结束这一轮事件循环。需要注意的是，如果其中一个微任务又添加了新的微任务，那么新添加的微任务会在当前tick执行。这也就意味着，如果一个微任务在执行的时候递归的添加微任务，或者执行了一个阻塞的操作(例如死循环)，那么则会导致这轮事件循环很长时间或者永远不会结束，下一个宏任务会等待很长时间或者根本不会被执行。  
但是在node中存在process.nextTick()，这个API内置了一个保护措施:通过设置process.maxTickDepth来限制单次执行数量，默认值为1000。如果达到限制次数之后会将之后的微任务直接移除，使得下一次事件循环的宏任务能够被执行。  
- macro task：` js codes`,setTimeout, setInterval, setImmediate, requestAnimationFrame, I/O, UI rendering
- micro task：process.nextTick, Promises, Object.observe, MutationObserver  



## 初入React  
## XHR对象

