import isEqual from 'lodash/isEqual'

function isFunction (func) {
  return typeof func === 'function'
}

let getList = () => ({
  tableData: [],
  pagination: {},
  total: 0

})

let originPagination = {
  page_size: 10,
  page_index: 1
}

let originHandleError
let hasSetPaginationSize = false
let hasSetPaginationIndex = false
let hasSetHandleError = false
export function setBaseModelConfig (options) {
  if (!isFunction(options.getList)) {
    throw new TypeError('getList is not a Function.')
  }

  if (options.handleError && !isFunction(options.handleError)) {
    throw new TypeError('handleError is not a Function.')
  }

  getList = options.getList
  if (options.pagination && options.pagination.page_size && !hasSetPaginationSize) originPagination.page_size = options.pagination.page_size
  if (options.pagination && options.pagination.page_index && !hasSetPaginationIndex) originPagination.page_index = options.pagination.page_index
  if (options.handleError && !hasSetHandleError) {
    originHandleError = options.handleError
  }
}

const checkPagination = (pagenation) => {
  if (!pagenation) return
  if (typeof pagenation === 'object') {
    if (!Object.prototype.hasOwnProperty.call(pagenation, 'page_size') && Object.prototype.hasOwnProperty.call(pagenation, 'page_index')) {
      throw new TypeError('(page_size || page_index) is not in pagenation')
    }
  } else {
    throw new TypeError('pagenation is not a Object')
  }
}

const checkHandleError = (handleError) => {
  if (handleError && !isFunction(handleError)) {
    throw new TypeError('handleError is not a Function.')
  }
}

class BaseModelClass {
  constructor (options) {
    this.originPagination = originPagination
    this.hasSetPaginationSize = false
    this.hasSetPaginationIndex = false
    this.hasSetHandleError = false
    this.hasSetHandleError = false

    this.fetch = options.fetch
    this.pagination = options.pagination
    this.handleError = options.handleError

    return this.baseModel(options)
  }

  baseModel ({fetch, pagination, handleError}) {
    if (!isFunction(fetch)) {
      throw new TypeError('fetch is not a Function.')
    }
    checkPagination(pagination)
    checkHandleError(handleError)
    if (pagination && pagination.page_size) {
      this.hasSetPaginationSize = true
      this.originPagination.page_size = pagination.page_size
    }
    if (pagination && pagination.page_index) {
      this.hasSetPaginationIndex = true
      this.originPagination.page_index = pagination.page_index
    }
    if (handleError && isFunction(handleError)) {
      this.originHandleError = handleError
      this.hasSetHandleError = true
    }

    return ({
      namespaced: true,
      state: () => ({
        total: 0,
        pagination: this.originPagination,
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
          try {
            // 如果filter和之前的条件不等 则从第一页开始获取数据
            if (!isEqual(filters, state.filters)) {
              pagination.page_index = 1
            }
            const parmas = {
              ...pagination,
              ...filters
            }

            const originData = await fetch(parmas)
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
            if (originHandleError && isFunction(originHandleError)) {
              originHandleError(err, this)
            } else {
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
          const filters = payload
          dispatch('query', {
            filters,
            pagination: this.originPagination
          })
        }
      }
    })
  }
}

const createBaseModel = (props) => new BaseModelClass(props)
export default createBaseModel
