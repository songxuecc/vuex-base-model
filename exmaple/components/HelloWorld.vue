<template>
  <div>
    <el-select v-model="taskTitle" placeholder="活动区域" @change="setFilter" clearable>
      <el-option label="批量改类目属性" value="批量改类目属性"></el-option>
      <el-option label="批量上下架" value="批量上下架"></el-option>
    </el-select>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="task_title" label="类目" width="180"> </el-table-column>
      <el-table-column prop="status_str" label="状态"> </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.page_index"
      :page-sizes="[1,10, 20, 50, 100]"
      :page-size="pagination.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

  <script>
  import { mapActions,mapState } from "vuex";
export default {
  data() {
    return { 
      taskTitle:''
    }
  },
  async created(){
    await this.query()
    this.otherAction()
  },
  computed:{
    ...mapState('example',['pagination','tableData','filters','total']),
    ...mapState({
      loading: state => {
        return state['@@loading'].effects['example/query']
      }
    })
  },
  methods:{
    ...mapActions('example',['handleCurrentChange','query','getters','handleSizeChange','otherAction','setFilter'])
  }
}
</script>