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



##### 自定义指令 
##### 组件自动注册
##### 通过performance面板调试，优化页面加载速度
1. 代码分割，组件动态加载模块
2. debounce和throttle 使用


列表请求
### setBaseModelConfig 配置
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| getList | 配置从接口响应中得到数据列表规范化处理 | Function(response) => ({ tableData: [], total: {}}) | - |
| formatParmas | 配置从调用处请求的参数格式化，用于合并分页和筛选的数据 | Function(parmas: Object) => Object | - |
| handleError | 请求错误警告异常 | Function(err: Error, self: vm ) => Any | - |
| pagination | 初始分页器配置 | {page_size: number,page_index: number} | - |


### setBaseModelConfig 配置
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| getList | 配置从接口响应中得到数据列表规范化处理 | Function(response) => ({ tableData: [], total: {}}) | - |
| formatParmas | 配置从调用处请求的参数格式化，用于合并分页和筛选的数据 | Function(parmas: Object) => Object | - |
| handleError | 请求错误警告异常 | Function(err: Error, self: vm ) => Any | - |
| pagination | 初始分页器配置 | {page_size: number,page_index: number} | - |


### 调用方法
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| query | 列表查询 | Function({pagination, filters })  | - |
| handleSizeChange | pageSize 改变时会触发 | Function({pagination, filters })  | - |
| handleCurrentChange | currentPage 改变时会触发 | Function({pagination, filters })  | - |
| setFilter | 设置查询条件 - | Function({ pagination, filters })  | - |
| clearFilters | 删除查询条件 - | Function()  | - |

### 在**store.js**中的注册
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import createLoadingPlugin from './plugins/createLoadingPlugin'
import {setBaseModelConfig} from '@commonModels/createBaseModel.js'
import productManagement from './modules/productManagement'
import customerSetting from './modules/customerSetting'

setBaseModelConfig({
  // 列表获取
  getList: (response) => {
    let tableData
    tableData = response.items
    return {
      tableData,
      total: response.total
    }
  },
  // 参数格式化 
  formatParmas: (parmas) => {
    // 合并分页和筛选的数据
    return {
      ...parmas.pagination,
      ...parmas.filters
    }
  },
  // 错误警告
  handleError: (err, self) => {
    self._vm.$message({
      message: `${err}`,
      type: 'error'
    })
  },
  // 分页配置
  pagination: {
    page_size: 10,
    page_index: 1
  }
})

Vue.use(Vuex)
const modules = {
  ...productManagement,
  ...customerSetting
}

export default new Vuex.Store({
  modules,
  plugins: [createLoadingPlugin({Vue})]
})

```
### 在**vuex**文件中的挂载
```js
import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import services from '@services'

const model = modelExtend(
  createBaseModel({
    fetch: services.userCapturePage
  }),
  {
    namespaced: true,
    state: () => ({
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        await dispatch('query', { ...payload })
      }
    },
    getters: {

    }
  })
export default model

```

### 在**.vue**文件中的调用
```html
<!-- 额度消耗记录-->
<template>
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
      <el-table-empty slot="empty" />
      <el-table-column
        prop="create_time"
        label="复制时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="url"
        label="复制链接">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.page_index"
      class="pt-20 right mr-20"
      :page-size="pagination.page_size"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ConsumptionRecord',
  data () {
    return {
    }
  },
  created(){
    this.fetch({
        pagination: {
          page_size: 10,
          page_index: 1
        }
      })
  },
  computed: {
    ...mapState('customerSetting/paidRecharge/consumptionRecord', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ]),
    ...mapState({
      loading: state => state['@@loading'].effects['customerSetting/paidRecharge/consumptionRecord/fetch']
    })
  },
  methods: {
    ...mapActions('customerSetting/paidRecharge/consumptionRecord', [
      'handleCurrentChange',
      'handleSizeChange',
      'setFilter',
      'fetch'
    ])
  }
}
</script>
```