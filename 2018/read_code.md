# 源码阅读笔记  
## Vue.js 
- 响应式原理  
在Vue实例初始化的时候会将data转换成可observe的key-value，如下源码:
```js
function initData (vm: Component) {
  let data = vm.$options.data    // 这里拿到options中data
  // 判断data是否是个函数 且返回值是否为对象
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
        //这里进行数据的代理
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}

```
initData方法中主要是对data对象的初始化，并将这个data转换成可观测的.调用ovserve方法会尝试对传入的data创建一个Observe实例并返回,如果这个对象已经是可观测的了则会返回之前的Observe实例.Observe对象主要是对绑定的可观测对象的key-value进行转换，每一个key都会转换成 getter/setter,这里存在递归转换的情况。若目标对象中的一个键值是数组或者是对象，那么会递归调用这个方法进行转换。
 ```js
 /**
 * 尝试对传入的对象创建一个observe实例，并绑定在对象的__ob__上。
 */
function observe (value: any, asRootData: ?boolean): Observer | void {
  // 判断value是否是个对象
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 如果这个对象已经存在obseve实例，则返回__ob__ 
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 创建一个observer实例
    ob = new Observer(value)
  }
  // 如果是根实例所依赖的observer实例则 vmCount计数加一
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    // 这里的dep实例用来收集渲染时所依赖的数据，只有依赖的数据发生改变// 的时候才会触发re-render
    this.dep = new Dep()
    this.vmCount = 0
    // def方法用来定义一个对象的属性
    // 用到了Object.defineProperty
    // 这里是把这个observer实例绑定到了对象的__ob__属性上
    def(value, '__ob__', this)
    // 判断是否是数组 如果是数组的话会重写数组的方法
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      // observeArray方法会遍历整个数组并对每个数组元素调用observe方// 法 
      this.observeArray(value)
    } else {
      // 如果是一个普通的对象则会调用walk方法
      // walk方法会遍历对象本身的每一个key 并调用defineReactive方法
      this.walk(value)
    }
  }
 ```
 在初始化data的时候，一个数组中的所有元素(对象)都会转换成可观测的。如果之后的数组push了一个新的元素的，则必须把新的元素也变成可观测的,为此vue源码中用到了两个方法将常用的数组方法进行了重写。
 - 如果当前环境可以访问__proto__属性那么直接改变这个数组对象的原型链，把__proto__指向已经重写数组方法的对象上,重写的数组原型又以原生的数组原型为原型对象
 ```js
// 以原生的数组原型为原型对象构造一个新的对象
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  // 重写原生数组方法的时候会先调用一次原生的数组方法 相当于在原来方法// 的基础上增加了观测新增元素的操作
  def(arrayMethods, method, function mutator (...args) {
    // 调用原生的方法
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 调用这个对象上面绑定ob实例的observeArray方法观测这个新增元素
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result  //返回调用原生方法的结果
  })
})
// 这个函数用到了ES6的rest参数以及扩展运算符
// see http://es6.ruanyifeng.com/?search=rest&x=0&y=0#docs/function#rest-参数
```
walk方法遍历这个对象，对自身的每一个key调用defineReactive方法:
```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 每一个key都会new一个Dep类
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  // 如果是深转换 那么会递归调用observe方法去进行转换
  let childOb = !shallow && observe(val)
  //  进行数据绑定
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      // Dep.target是一个全局值 指向一个watcher对象
      if (Dep.target) {
        // 调用dep的denpend方法将这个依赖dep添加到当前的watcher对象中
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 如果新的值是一个对象的话同样会把这个对象变为可observe的
      childOb = !shallow && observe(newVal)
      //  这里的dep指向当前值的dep
      // 调用dep的notify方法会通知所有依赖了这个dep的watcher
      dep.notify()
    }
  })
}
```
这里看了很久的一点是为什么每一个值都会new一个Dep类，后来一步一步看了initdata的源码再加上watcher类的源码，发现在initData的时候每一个键值对都会new一个Dep对象，这个Dep对象代表了这个值的依赖。Dep类的定义如下:
```js
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```
其中每一个dep类都会保存一个subs数组，这个数组里面是所有依赖了这个值的watcher对象，之前说过每一个值都会new一个Dep类，也就说这个Dep类和键值是一对一的关系，当某个watcher依赖到这个值的时候会将这个watcher对象push到subs中，当值改变触发setter的时候会调用这个notify方法通知所有依赖这个值的watcher对象。  
- 需要注意的是，Dep类有个全局值，Dep.target指向了当前watcher对象:
```js
// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}
```
这样看来Vue响应式的实现其实是用到了观察者模式,每一个watcher是一个观察者，数据是目标，当watcher依赖到某个数据的时候会将自身注册到目标上，这里dep类就是目标，同时watcher也会记录自已已经注册了的目标dep，当数据发生变化的时候dep类调用notify方法发布消息，所有注册了的watcher会收到消息并调用update方法。
```js
/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: ISet;
  newDepIds: ISet;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: Object
  ) {
    this.vm = vm
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }
  /**
   * Add a dependency to this directive.
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        // 在这个dep对象中注册watcher
        dep.addSub(this)
      }
    }
  }
  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}

```
- __何时去做依赖收集？__  
在watcher对象构造函数中当lazy为false的时候会调用get方法.get方法中首先将这个watcher对象赋值给Dep.target这个全局值.然后会尝试调用watcher入的getter方法，最后会调用cleanupDeps方法清理此次收集的依赖
```js
 /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
    /**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    // newDepIds是存储当前所依赖的depId
    // 遍历deps如果在newDepIds没有找到该ID则取消这个dep的注册
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    // 交换newDepIds与depIds
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

```  
可以看到update方法中对值改变之后的处理不一定是同步的，这里想到之前用vue的 __缓冲队列__ 
- 当值改变之后Vue不会马上重新渲染，而是会缓冲这次的更改，在nextTick的时候才会触发重新渲染,如果要在下次重新渲染的时候做一些操作，则需要调用nextTick方法
在update方法中,会判断当前option的sync来判断是否直接调用run函数.
run函数定义如下:
```js
 /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
```  
run函数是由Scheduler调用的，在run函数中会调用这个watcher的回调，Scheduler主要是对watcher队列的调度.watcher触发update函数的时候默认会将自身推入到一个观察者队列:
```js
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
```  
queueWatcher函数定义如下:
```js
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```
push一个观察者的时候会进行去重操作，相同的观察者不会第二次被push到这个队列中，除非观察者队列已经被清空过了。在Scheduler中还存有一个哈希表，这个哈希表映射了已经存在的观察者的id。在插入watcher的时候如果队列已经被清空过那么插入的watcher必须按id升序排列。waiting标志位用来指示当前队列的状态是否处于等待状态，不处于等待状态的话会调用nextTick方法将flushSchedulerQueue函数推入下一次事件循环中，在下一次事件循环的时候执行flushSchedulerQueue函数
flushSchedulerQueue函数的作用就是清空当前队列并执行watcher的回调
```js
/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  // 在清空之前对队列进行排序，确保:
  // 1. 组件的更新是从父组件到子组件(父组件的创建总是先于子组件)
  // 2. 组件中用户自定义的watcher先于render watcher(这是因为在实例初// 始化的时候用户定义的watcher是先创建的)
  // see /core/instance/state.js
  // 3. 在父组件的watcher运行的时候子组件被销毁，那么这些watcher可以直// 接跳过
  queue.sort((a, b) => a.id - b.id)
  
  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  // 这里循环的时候直接取queue.length是因为在flush的过程中可能还会有新// 的watcher push
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}
```  
- nextTick函数的实现:
```js
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
nextTick函数中会首先将传入的回调包在一个匿名函数里然后push到callbacks数组中,pending标志位用于指示当前的任务队列是否已经加入到task循环中了，如果没有的话会根据useMacroTask来调用相应的方法把这些回调加入到task循环中。对于microTimerFunc的实现会根据环境选择不同的方式 
- 利用promise
- setImmediate(macro task)
- MessageChannel
- setTimeout  
最后三种是macrotask的实现方式，当不支持promise的时候会使用macrotask  
- 为什么优先使用micro的方式:   
see https://www.zhihu.com/question/55364497/answer/144215284  



