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
## js中如何进行对象的深复制  
## 对中文名的排序  
## 页面需要用到的权限信息如何在node层传出  
## TCP协议  
## 再探HTTP

