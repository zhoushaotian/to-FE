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
## 看板池首页的store  
### 首页header组件    
1. data：待选所有**个人看板数据**(待选搜索数据)[Object]  
2. methods:   
addBoardPoor:增加看板池按钮的handle  
link：导出报表连接的handle  
querySearchAsync： 搜索框的查询回调  
createFilter： 返回一个过滤器函数  
handleSelect： 搜索况待选项选中时触发的回调  
3. 生命周期钩子  
mounted: 请求所有看板数据 
 
### 首页看板组件  
1. data:  
addBoardFlag: 新增看板对话框的显示标志  
boardStdTemplate：新增看板对话框的**标准模板数据**  
boardDiyTemplate： 新增看板对话框的**自定义模板数据**  
addBoardOptions： 新增看板的表单数据包含模板ID、新增看板名、审核ID  
personalBoard: 新增自定义模板的所有**个人看板数据**  
addTemplateOption: 新增自定义模板的options数据对象  
2. props:  
name: 看板名  
bkColor：看板背景颜色，默认为white  
newBoard: 是否是新建看板按钮  
fontColor： 字体颜色  
3. methods:  
deleteBoard: 点击删除看板时的回调  
boardClick: 点击看板时候的回调  
handleAddBoardOptions: 新建看板的时候选择某个模板的回调  
handleAddDiy：点击新建自定义模板的回调  
addBoard： 确认创建看板的回调  
addTemplate: 确认创建模板的回调  
handleListShow: 看板池收起按钮的回调  
enterBoard: 预览某个看板的回调  
### 首页单个看板池组件  
1. data:  
showFlag: 看板池收起标志  
2. props:  
icon: 看板池的图标  
name: 看板池名  
boardList: 该看板池的所有看板 [object]  
---
### 看板池页面  
1. data:  
oldBoard: 已**归档看板** [Object]  
watchOptions: 查看已归档看板时候的选项  
watchOldBoard： 查看已归档看板对话框的显示标志  
boardPoorList: 个人所见所有**看板池数据** [Object]  
2. components:
boardHeader
poor  
3. methods:  
handleCancel: 看板撤销归档的回调  
handleDelete：看板彻底删除的回调  
handleTime： 时间选择的回调  
### 导出报表页面  
1. data:  
options: 卡片筛选选项  
boardList：个人所见**所有看板数据** [object]  
2. methods：  
handleTime:时间选择处理  
handleExportExcel:导出报表处理  
handleCancel: 取消逻辑  
---  








