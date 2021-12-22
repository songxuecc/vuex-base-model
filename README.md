# example

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


## 项目内部优化-代码
##### vuex模块抽离与plugin和全局loading
1. vuex-model-extend   类目dva的 dva-model-extend
2. vuex-plugin-loading 类目dva的 action的loading中间件
3. vuex-base-model     列表的请求和筛选，查询封装
4. vuex-auto-register  自动注册model

这个功能我思考过用mixins编写此功能。但是需要添加配置，所以mixins无法满足需求。且请求数据放在vuex里，我也感觉更合理一点

vuex-base-model返回的数据结构为
```javascript
{
    namespaced:true,
    state:()=>{
        tableData,
        
    }
}
```


##### 自定义指令 
##### 组件自动注册
##### 通过performance面板调试，优化页面加载速度
1. 代码分割，组件动态加载模块
2. debounce和throttle 使用



列表请求
### config

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| getList | 配置如何从接口响应中得到数据列表和分页器 | (response) => ({ tableData: [], total: {}}) | - |
| originPagination | 初始分页器数据 | (response) => ({ tableData: [], total: {}}) | - |

### set
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fetchMethod | 带查询参数的数据列表请求方法 | (paylaod) => Response | - |

### 方法
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| sizeChange | pageSize 改变时会触发 - |
| currentChange | currentPage 改变时会触发 - |
| onPrevClick | 用户点击上一页按钮改变当前页后触发 - |
| onNextClick | 用户点击下一页按钮改变当前页后触发 - |
| setFilter | 点击查询按钮 - |
| query | 请求数据初始化时 - |