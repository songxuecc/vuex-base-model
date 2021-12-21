import isEqual from 'lodash/isEqual'
import debounce from 'lodash/debounce'

function isFunction (func) {
  return typeof func === 'function'
}

let getList = () => ({
  tableData: [],
  pagination: {},
  total: 0
})

let formatParmas = (parmas) => ({
  ...parmas.pagination,
  ...parmas.filters
})

let originPagination = {
  page_size: 10,
  page_index: 1
}

let handleError = () => {}

export function setBaseModelConfig (options) {
  if (!isFunction(options.getList)) {
    throw new TypeError('getList is not a Function.')
  }
  if (!isFunction(options.handleError)) {
    throw new TypeError('handleError is not a Function.')
  }
  if (!isFunction(options.formatParmas)) {
    throw new TypeError('formatParmas is not a Function.')
  }
  if (options.getList) getList = options.getList
  if (options.formatParmas) formatParmas = options.formatParmas
  if (options.handleError) handleError = options.handleError

  if (options.pagination && options.pagination.page_size) originPagination.page_size = options.pagination.page_size
  if (options.pagination && options.pagination.page_index) originPagination.page_index = options.pagination.page_index
}

const checkHandleError = (handleError) => {
  if (handleError && !isFunction(handleError)) {
    throw new TypeError('handleError is not a Function.')
  }
}

const checkFetch = (fetch) => {
  if (fetch && !isFunction(fetch)) {
    throw new TypeError('fetch is not a Function.')
  }
}

class BaseModelClass {
  constructor (options) {
    checkFetch(options.fetch)
    checkHandleError(options.handleError)
    // 初始化pagination
    this.originPagination = {}
    // 是否首次请求
    this.isFitsrFetch = true
    // 请求函数
    this.fetch = options.fetch

    // 函数名称前缀
    this.name = options.name

    return this.baseModel()
  }

  baseModel () {
    const self = this

    return ({
      namespaced: true,
      // 在extends的model.state里写同key值数据就可以覆盖本下面初始化的model.state
      state: () => ({
        total: 0,
        pagination: originPagination,
        filters: {},
        tableData: []
      }),
      mutations: {
        save (state, payload) {
          Object.assign(state, payload)
        }
      },
      actions: {
        async query ({
          commit,
          state
        }, payload) {
          const {pagination = state.pagination, filters = {}} = payload || {}

          // 保存初始化的pagination
          if (self.isFitsrFetch) {
            self.originPagination = state.pagination
            self.isFitsrFetch = false
          }

          try {
            // 如果filter和之前的条件不等 则从第一页开始获取数据
            if (!isEqual(filters, state.filters)) {
              pagination.page_index = 1
            }
            const parmas = {
              pagination,
              filters
            }

            const originData = await self.fetch(formatParmas(parmas))
            const formatData = getList(originData)
            const nextFilters = filters
            const nextTotal = formatData.total
            const nextTableData = formatData.tableData
            commit('save', {
              pagination,
              filters: nextFilters,
              tableData: nextTableData,
              total: nextTotal
            })
            return formatData
          } catch (err) {
            if (handleError) {
              let debounceHandleError = debounce(handleError, 1500)
              debounceHandleError(err, this)
            } else {
              console.log(`[createBaseModel] : ${err}`)
              throw new Error(err)
            }
          }
        },
        handleSizeChange ({
          state,
          dispatch
        }, payload) {
          const pagination = state.pagination
          pagination.page_size = payload
          pagination.page_index = 1
          const filters = state.filters
          dispatch('query', {
            pagination,
            filters
          })
        },
        handleCurrentChange ({
          state,
          dispatch
        }, payload) {
          const pagination = state.pagination
          pagination.page_index = payload
          const filters = state.filters
          dispatch('query', {
            pagination,
            filters
          })
        },
        setFilter ({
          dispatch
        }, payload) {
          const { filters } = payload
          dispatch('query', {
            filters,
            pagination: self.originPagination
          })
        },
        clearFilters ({
          commit
        }, payload) {
          commit('save', {
            filters: {}
          })
        }
      }
    })
  }
}

const createBaseModel = (props) => new BaseModelClass(props)
export default createBaseModel
