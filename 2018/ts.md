# ts
## 初识
```ts
// 定义一个枚举类型
enum ENUMSAB {A, B, C};

let aaaa:ENUMSAB = ENUMSAB.A;

// 定义一个接口
interface Color{
    a: string,
    b: number
}

function createColorAB(config: Color): {number: number, color: string} {
    return {
        number: config.b,
        color: config.a
    }
}

createColorAB({a: 'white', b: 1})

// 类
/**
 * protected 属性允许派生类访问
 * 但是private属性只允许在类中访问，继承的类不允许访问
 */
class Animal{
    protected name:string;
    constructor(name:string) {
        this.name = name;
    }
    say() {
        console.log(this.name);
    }
}
class Dog extends Animal{
    readonly year:number
    constructor(name:string, year:number) {
        super(name);
        this.year = year;
    }
    say() {
        console.log(this.name);
    }
}

abstract class Person{
    abstract say():void;
    move():void{
        console.log('im moving');
    }
}

class Man extends Person{
    say() {
        console.log('man');
    }
}

let dog = new Dog('he', 1);

// 泛型

function echo(arg:any):any {
    return arg;
}
// 使用泛型之后

function echoA<T>(arg:T):T {
    return arg;
}
// 泛型类
class Demo<T> {
    demo:T;
    constructor(demo:T) {
        this.demo = demo;
    }

}
interface person{
    name: string,
    year: number
}

let demo = new Demo<person>({name: 'a', year: 1});

// 枚举类型
enum PERSONENUM {
    a,
    b,
    c
}
// 反向映射

let enumA = PERSONENUM.a;
let enumAName = PERSONENUM[enumA];

// 声明一个全局变量
declare let a:number;
```