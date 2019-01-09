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
# Class的继承和super关键字
super关键字有两种情况，当super关键字作为一个函数调用时，它返回的是子类的实例，但是相当于调用了父类的构造方法。  
当super关键字作为一个对象调用的时候，又要区分两种情况，当在一个子类的普通方法中调用，它指向父类的原型对象，在静态方法中调用，它指向父类。另外如果通过super调用父类的普通方法时其this指向子类的实例。反之调用静态方法时this指向子类。
es5的继承总是先新建子类的this对象，然后调用父类的构造方法的apply方法将这个this对象传入，向子类的this对象上添加父类的方法和属性。而es6则是先新建父类对象的this再用子类的构造函数去修饰这个this。
# __proto__与prototype
在es5中构造函数存在两个属性__proto__和prototype分别指向构造这个构造函数的原型对象和该构造函数的原型对象(对象只有__proto__)在es6中的class也存在这两个属性，子类的__proto__属性，表示构造函数的继承，总是指向父类。子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。
# Generator && Thunk && currying
