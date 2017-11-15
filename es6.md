# Class
es6中的Class语法实际上是一个语法糖,与es5中的构造函数来声明一个类是相同的，例如:
```js
Class circle{
    constructor(){ //类的构造函数
        
    }
    draw() { //类的一个方法

    }
}
```
在类中定义的所有方法都被写在这个类的原型对象上,且Class中的this默认指向的是类的实例,如果要直接在实例上定义某个方法或者变量,需要显式的调用this定义.
- 类表达式
```js
const Person = Class{   //这是一个类表达式 声明了一个Person的类
    constructor() {

    }
}
```
- Class语法不存在变量提升
- 内部可以直接使用get和set关键字对某个属性设置存值函数和取值函数
# Generator
