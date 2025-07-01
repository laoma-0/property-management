<!--面包屑导航组件-->
<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item, index) in items" :key="index" :to="item.path">{{ item.label }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>