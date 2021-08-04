import { data } from "./data";

const len = Math.floor(Math.random() * 20)
let origin = []
for(let i = 0 ; i < len ;i++){
  origin = [...origin,...data.item_list]
}

export const fetch = (payload) => new Promise((res)=> {

    const filter = payload.filters
    const size = payload.pagination.page_size
    console.log(size,'size1');

    const index = payload.pagination.page_index
    let arr = [...origin]
    if(filter && filter.taskTitle){
      arr = arr.filter(item=> {
        return item.task_title === filter.taskTitle
      })
    }
    arr = arr.slice((index-1)*size, (index-1)*size + size)
    const r = {
      item_list:arr,
      total: origin.length
    }
    setTimeout(() => {
      res(r)
    }, 1000);
  })


  export const fetch2 = (payload) => new Promise((res)=> {
    const filter = payload.filters
    const size = payload.pagination.page_size
    const index = payload.pagination.page_index
    console.log(size,'size2');

    let arr = [...origin]
    if(filter && filter.taskTitle){
      arr = arr.filter(item=> {
        return item.task_title === filter.taskTitle
      })
    }
    arr = arr.slice((index-1)*size, (index-1)*size + size)
    const r = {
      item_list:arr,
      total: origin.length
    }
    setTimeout(() => {
      res(r)
    }, 1000);
  })


  export const fetch3 = (payload) => new Promise((res)=> {
    const filter = payload.filters
    const size = payload.pagination.page_size
    const index = payload.pagination.page_index
    console.log(size,'size3');

    let arr = [...origin]
    if(filter && filter.taskTitle){
      arr = arr.filter(item=> {
        return item.task_title === filter.taskTitle
      })
    }
    arr = arr.slice((index-1)*size, (index-1)*size + size)
    const r = {
      item_list:arr,
      total: origin.length
    }
    setTimeout(() => {
      res(r)
    }, 1000);
  })