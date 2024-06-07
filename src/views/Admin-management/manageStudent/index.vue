<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="header">
        <div class="title">学生列表</div>
      </div>
      <div class="middle">
        <!-- 搜索 -->
        <div class="search">
          <el-input v-model="searchInfo" class="search-input" placeholder="按照学号查找"/>
          <el-button type="primary" @click="onSubmit" :icon="Search" class="search-button">查询</el-button>
        </div>
        <!-- 添加学生，批量添加，批量删除部分 -->
        <div class="edit">
          <el-button type="primary" @click="onAdd">添加学生</el-button>
          <el-button type="primary" @click="onBatchAdd">批量添加</el-button>
          <el-button type="danger" @click="onBatchDelete">批量删除</el-button>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="学号" width="180" />
          <el-table-column prop="name" label="姓名" width="180" />
          <el-table-column prop="address" label="电话" />
          <el-table-column prop="address" label="微信号" />
          <el-table-column prop="address" label="操作" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue';

const searchInfo = ref('');
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<style lang="scss">
  @import './index';
  .middle{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .search{
      display: flex;
      .search-input{
        width: 700px;
      }
      .search-button{
        margin-left: 20px;
      }
    }
    .edit{

    }
  }
  
  
</style>
