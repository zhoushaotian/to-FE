# 需求池系统store设计  
- 所有api请求封装到fetch/api.js中，每一个接口返回一个promise，then回调的参数res是一个对象包含data,status,statusText等。另外api.js暴露的fetch方法可对现成api接口扩展，fetch方法接收url,method,params参数，同样返回一个promise对象。
- 组件内部所需的公共数据全部放到store里面，在组件中通过mapState方法映射为组件内部的计算属性。
- 在组件内部异步请求数据需要dispatch分发一个action，在store中一个action封装了一个异步请求，请求成功后的回调会通过commit一个mutation改变state中的数据。**改变store中的数据的唯一方法是commit一个mutation，而且mutation中的所有操作均是同步操作**
- mutation的第一个参数是局部state对象，第二个参数可以接受一个载荷。actions的第一个参数是一个上下文对象，这个上下文对象包含了局部state，全局commit，根节点的state，同样可以接收一个对象作为载荷。按如下方法声明和调用:
```
mutations: {
    changeData(state, payload) {
        state.count = payload.count;
    }
}
//在一个action中commit一个mutation
actions: {
    fetchData({commit},payload) {
        api.getUserData().then((res) => {
            commit('changeData',{count: res.data.count});
        }).catch((err) =>　{
            //错误处理的逻辑
        });
    }
}
//在组件中异步请求数据
created() {
    this.$store.dispatch('fetchData');
}
computed: {
    ...mapState({                   //mapState需要额外引入
        count: state => state.count   //将store中的count映射为局部的计算属性
    })                               //这里用对象展开符可以与组件内部的其他计算                                  //属性合并
}
```  
- mutation的命名可以另外引入一个枚举，所有的mutation定义通过枚举。
---




