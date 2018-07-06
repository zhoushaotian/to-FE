# redux
# redux-react
redux-react是官方的redux与react的绑定库，在readux的基础上做了二次封装来与react进行绑定。  
主要暴露了两个高阶组件:
1. Provider
Provider这个高阶组件利用context将全局唯一的store暴露给子组件，使得所有子组件可以访问store，并对store进行更新。
```js
export function createProvider(storeKey = 'store', subKey) {
    const subscriptionKey = subKey || `${storeKey}Subscription`

    class Provider extends Component {
        // 定义context，暴露store
        getChildContext() {
          return { [storeKey]: this[storeKey], [subscriptionKey]: null }
        }

        constructor(props, context) {
          super(props, context)
          // 全局唯一的store是通过Provider的store prop传递下去的
          // 挂载到Proviver实例中
          // <Provider store={store}>...子组件</Provider>
          this[storeKey] = props.store;
        }

        render() {
            // 保证Provider的子组件只有一个
          return Children.only(this.props.children)
        }
    }

    if (process.env.NODE_ENV !== 'production') {
      Provider.prototype.componentWillReceiveProps = function (nextProps) {
        if (this[storeKey] !== nextProps.store) {
          warnAboutReceivingStore()
        }
      }
    }

    Provider.propTypes = {
        store: storeShape.isRequired,
        children: PropTypes.element.isRequired,
    }
    Provider.childContextTypes = {
        [storeKey]: storeShape.isRequired,
        [subscriptionKey]: subscriptionShape,
    }

    return Provider
}

export default createProvider()
```
2. Connect  
