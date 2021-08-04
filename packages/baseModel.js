import isEqual from 'lodash/isEqual'

function isFunction(func) {
    return typeof func === "function";
}

let getList = () => ({
    tableData: [],
    pagination: {},
    total:0,

});

let originPagination = {
    page_size: 10,
    page_index: 1
}

let hasSetPaginationSize = false
let hasSetPaginationIndex = false

export function setConfig(options) {
    if (!isFunction(options.getList)) {
        throw new TypeError("getList is not a Function.");
    }
    getList = options.getList;
    if(options.pagination && options.pagination.page_size && !hasSetPaginationSize) originPagination.page_size = options.pagination.page_size;
    if(options.pagination && options.pagination.page_index && !hasSetPaginationIndex) originPagination.page_index = options.pagination.page_index;
}

const checkPagination = (pagenation) => {
    if(typeof pagenation === 'object'){
        if(!Object.prototype.hasOwnProperty.call(pagenation, 'page_size') && Object.prototype.hasOwnProperty.call(pagenation, 'page_index')){
            throw new TypeError("(page_size || page_index) is not in pagenation");
        }
    } else if(pagenation){
        throw new TypeError("pagenation is not a Object");
    }
}
const baseModel = ({fetch,pagination}) => {

    if (!isFunction(fetch)) {
        throw new TypeError("fetch is not a Function.");
    }

    let pagenation = {
        page_size: 10,
        page_index: 1
    }
    let hasSetPaginationSize = false
    let hasSetPaginationIndex = false

    checkPagination(pagination)
    if(pagination && pagination.page_size) {
        hasSetPaginationSize = true
        pagenation.page_size = pagination.page_size;
    }
    if(pagination && pagination.page_index) {
        hasSetPaginationIndex = true
        pagenation.page_index = pagination.page_index;
    }

    if(!hasSetPaginationSize ){
        pagenation.page_size = originPagination.page_size;
    }
    if(!hasSetPaginationIndex ){
        pagenation.page_index = originPagination.page_index;
    }

    return ({
        namespaced:true,
        state: () => ({
            total: 0,
            pagination: pagenation,
            filters:{},
            tableData:[]
        }),
        mutations: {
            save(state, payload) {
                console.log(state,payload, 'payload')
                Object.assign(state, payload)
            }
        },
        actions: {
            async query({
                commit,
                state,
            }, payload) {
                const {pagination = state.pagination , filters} = payload || {}
                console.log(state.pagination,'state.pagination');
                console.log(pagination,'pagination');
                 try {
                    // 如果filter和之前的条件不等 则从第一页开始获取数据
                    if (!isEqual(filters, state.filters)) {
                        pagination.page_index = 1
                    }
                    const parmas = {
                        pagination,
                        filters
                    }

                    const originData = await fetch(parmas)
                    const formatData = getList(originData)
                    const nextFilters = filters
                    const nextTotal = formatData.total
                    const nextTableData = formatData.tableData
                    commit('save', {
                        pagination,
                        filters:nextFilters,
                        tableData:nextTableData,
                        total: nextTotal
                      })
                    return formatData
                 } catch (err) {
                     throw new Error(err)
                 }
            },
            handleSizeChange({
                state,
                dispatch
            }, payload) {
                const pagination = state.pagination
                pagination.page_size = payload
                const filters = state.filters
                dispatch('query',{
                    pagination,
                    filters
                })
            },
            handleCurrentChange({
                state,
                dispatch
            }, payload) {
                const pagination = state.pagination
                pagination.page_index = payload
                const filters = state.filters
                dispatch('query',{
                    pagination,
                    filters
                })
            },
            setFilter({
                dispatch
            }, payload) {
                const filters = payload
                dispatch('query',{
                    filters,
                    pagination: originPagination
                })
            }
        }
    })
}

export default baseModel