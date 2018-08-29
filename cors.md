# cors跨域
## 何为cors
cors是跨域资源共享的一种解决方案，需要现代浏览器支持，通过http请求头以及options方法来控制跨域。其分为两种类型
1. 简单cors请求  
2. 非简单cors请求  
> 浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。
只要同时满足以下两大条件，就属于简单请求。  
（1) 请求方法是以下三种方法之一：  
HEAD  
GET  
POST  
（2）HTTP的头信息不超出以下几种字段：  
Accept  
Accept-Language  
Content-Language  
Last-Event-ID  
Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain  
凡是不同时满足上面两个条件，就属于非简单请求。
浏览器对这两种请求的处理，是不一样的
## 简单cors请求
简单cors请求浏览器会自动在请求头中加入origin字段标识该请求来源于哪个域，如果Origin指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头信息没有包含Access-Control-Allow-Origin字段（详见下文），就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200。
## 非简单cors请求
非简单请求是那种对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json。  
非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。  
浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。  
**且非简单cors请求的预检请求不允许重定向，一旦请求发现重定向则会抛错**。
## 如何携带cookie信息
cors默认不发送cookie与http认证信息，如果需要把cookie发送到服务器，一方面需要服务器同意，指定Access-Control-Allow-Credentials字段，另一方面，开发者必须在AJAX请求中打开withCredentials属性。需要注意的是，如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的document.cookie也无法读取服务器域名下的Cookie。