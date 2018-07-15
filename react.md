# React
## 高阶组件HOC
### 定义
高阶组件就是一个接受react组件作为参数的函数，这个函数会返回一个新的组件。
```jsx
function HOC(Wrapped) {
    return class extends Componet{
        constructor(props) {
            // ...做一些处理
        }
        render() {
            return <Wrapped {...this.props}/>
        }
    }
}
```
### 使用
很多场景下一些组件的逻辑是可以复用的，举个例子，例如一个获取列表的组件，都是向远程请求数据并渲染，唯一不同的是远程源。这个时候就可以用到高阶组件去配置这个远程源，并返回一个新的组件。再如rc-form对表单项做了一层抽象，所有的表单项都可以用一个缓存值和一个值变换函数来标识，缓存值暴露给外部，值变化函数是当用户输入的时候去调用去更新这个缓存值。用代码来表示：
```jsx
function getFormItem(Wrapped, options) {
    return class extends Componet {
        constructor(props) {
            // 新组件用state去缓存value
            this.state = {
                value: options.initValue
            };
            this.handleValueChange = this.handleValueChange.bind(this);
        }
        render() {
            const {value} = this.state;
            // 所有被包裹的组件需要提供onChange这个props
            return <Wrapped value={value} onChange={this.handleValueChange} {...this.props}/>
        }
        handleValueChange(newValue) {
            this.setState({
                value: newValue
            });
        }
    }
}
```
这里可以看出，对高阶组件来说，有点类似于容器组件，即将被装饰的组件作为子组件渲染出来。不同的是，容器组件直接渲染子组件，而高阶组件会返回一个可配置的新的组件。  
**需要注意的是高阶组件返回的新组件不会继承原组件所定义的静态方法**
```jsx
function HOC(Wrapped) {
    return class extends Compoent {
        render() {
            return <Wrapped {...this.props}/>
        }
    }
}
const Demo = class extends Compont {
    render() {
        return <span></span>
    }
}
Demo.staticFunc = function() {
    console.log(111);
}

const HOCDemo = HOC(Demo);
typeof HOCDemo.staticFunc // undefined
```
对此，hoist-non-react-statics会来帮你自动处理，它会自动拷贝所有非React的静态方法。
