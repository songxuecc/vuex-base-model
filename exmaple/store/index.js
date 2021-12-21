import Vue from 'vue'
import Vuex from 'vuex'
import {createLoadingPlugin, setBaseModelConfig } from '../packages'
import example from './example'
// import example2 from './example2'
import example3 from './example3'

setBaseModelConfig({
  getList: (data) => {
    return {
      tableData:  data.item_list,
      total: data.total,
    }
  },
  pagination: {
    page_size: 10,
    page_index: 1,
  },
  formatParmas:(parmas)=> {
    return {
      ...parmas.pagination,
      ...parmas.filters,
    }
  },
  handleError: (err, self) => {
    self._vm.$message({
      message: `${err}`,
      type: 'error'
    })
  },
})


Vue.use(Vuex)

const modules = {
  example,
  // example2,
  example3
}
console.log(modules);
export default new Vuex.Store({
  modules,
  plugins: [createLoadingPlugin({Vue})]
})
