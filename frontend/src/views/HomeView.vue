<!-- src/views/AnnouncementManagement.vue -->
<template>
  <div class="announcement-management-container">
    <div class="flex justify-between items-center mb-4">
      <h2>公告管理</h2>
      <el-button type="primary" @click="handleAddAnnouncement">
        <el-icon><Plus /></el-icon> 发布公告
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <el-row class="mb-4">
      <el-col :span="8">
        <el-input
            v-model="searchQuery"
            placeholder="搜索公告标题"
            clearable
            @keyup.enter="fetchAnnouncements"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button @click="fetchAnnouncements">搜索</el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="6" :offset="10">
        <el-select v-model="announcementType" placeholder="公告类型" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="通知" value="notice"></el-option>
          <el-option label="维修" value="maintenance"></el-option>
          <el-option label="缴费" value="payment"></el-option>
          <el-option label="活动" value="event"></el-option>
        </el-select>
      </el-col>
    </el-row>

    <!-- 公告列表 -->
    <el-table
        :data="announcementList"
        stripe
        border
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="title" label="标题">
        <template #default="scope">
          <span class="inline-block px-1.5 py-0.5 text-xs rounded mr-1.5" :class="getTypeClass(scope.row.type)">
            {{ getTypeName(scope.row.type) }}
          </span>
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column prop="publishDate" label="发布日期" width="140"></el-table-column>
      <el-table-column prop="publisher" label="发布人" width="100"></el-table-column>
      <el-table-column prop="isUrgent" label="紧急" width="80">
        <template #default="scope">
          <el-switch
              v-model="scope.row.isUrgent"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateUrgentStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEditAnnouncement(scope.row)">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDeleteAnnouncement(scope.row)">
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        class="mt-4 flex justify-center"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    ></el-pagination>

    <!-- 新增/编辑公告对话框 -->
    <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogTitle"
        width="600px"
        :before-close="handleClose"
    >
      <template #content>
        <el-form :model="formData" ref="formRef" label-width="100px">
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="formData.title" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="公告类型" prop="type">
            <el-radio-group v-model="formData.type">
              <el-radio label="notice">通知</el-radio>
              <el-radio label="maintenance">维修</el-radio>
              <el-radio label="payment">缴费</el-radio>
              <el-radio label="event">活动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否紧急" prop="isUrgent">
            <el-switch v-model="formData.isUrgent"></el-switch>
          </el-form-item>
          <el-form-item label="公告内容" prop="content">
            <el-input type="textarea" v-model="formData.content" :rows="8"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAnnouncement">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
        :visible.sync="deleteDialogVisible"
        title="确认删除"
        width="350px"
        center
    >
      <template #content>
        <p>确定要删除选中的公告吗？此操作不可撤销。</p>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确认删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义数据
const state = reactive({
  announcementList: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  searchQuery: '',
  announcementType: '',
  dialogVisible: false,
  dialogTitle: '',
  formData: {
    id: null,
    title: '',
    type: 'notice',
    isUrgent: false,
    content: '',
    publishDate: '',
    publisher: ''
  },
  multipleSelection: [],
  deleteDialogVisible: false,
  selectedIds: []
})

// 解构state以便在模板中使用
const {
  announcementList, total, currentPage, pageSize,
  searchQuery, announcementType, dialogVisible,
  dialogTitle, formData, multipleSelection,
  deleteDialogVisible, selectedIds
} = toRefs(state)

// 获取公告列表
const fetchAnnouncements = async () => {
  try {
    // 模拟API请求
    const mockData = [
      {
        id: 1,
        title: "关于小区电梯维修的通知",
        type: "maintenance",
        isUrgent: true,
        content: "本小区3号楼电梯将于7月5日至7月7日进行例行维护...",
        publishDate: "2025-07-04",
        publisher: "物业管理员"
      },
      {
        id: 2,
        title: "7月物业费缴费通知",
        type: "payment",
        isUrgent: false,
        content: "7月物业费缴费日期为7月1日至7月15日...",
        publishDate: "2025-07-01",
        publisher: "财务部门"
      },
      // 更多模拟数据...
    ]

    announcementList.value = mockData
    total.value = mockData.length
  } catch (error) {
    ElMessage.error('获取公告列表失败')
    console.error(error)
  }
}

// 处理分页
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  fetchAnnouncements()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  fetchAnnouncements()
}

// 处理选择变更
const handleSelectionChange = (val) => {
  multipleSelection.value = val
  selectedIds.value = val.map(item => item.id)
}

// 新增公告
const handleAddAnnouncement = () => {
  dialogTitle.value = '发布公告'
  formData.value = {
    id: null,
    title: '',
    type: 'notice',
    isUrgent: false,
    content: '',
    publishDate: new Date().toISOString().split('T')[0],
    publisher: '管理员'
  }
  dialogVisible.value = true
}

// 编辑公告
const handleEditAnnouncement = (row) => {
  dialogTitle.value = '编辑公告'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 保存公告
const saveAnnouncement = () => {
  // 表单验证
  if (!formData.value.title) {
    ElMessage.warning('请输入公告标题')
    return
  }

  if (!formData.value.content) {
    ElMessage.warning('请输入公告内容')
    return
  }

  // 模拟保存
  try {
    if (formData.value.id) {
      // 更新公告
      const index = announcementList.value.findIndex(item => item.id === formData.value.id)
      if (index !== -1) {
        announcementList.value.splice(index, 1, formData.value)
      }
      ElMessage.success('公告更新成功')
    } else {
      // 新增公告
      const newId = announcementList.value.length > 0
          ? Math.max(...announcementList.value.map(item => item.id)) + 1
          : 1

      formData.value.id = newId
      announcementList.value.unshift({ ...formData.value })
      total.value++
      ElMessage.success('公告发布成功')
    }

    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败，请重试')
    console.error(error)
  }
}

// 删除公告
const handleDeleteAnnouncement = (row) => {
  selectedIds.value = [row.id]
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = () => {
  try {
    // 模拟删除
    announcementList.value = announcementList.value.filter(
        item => !selectedIds.value.includes(item.id)
    )
    total.value = announcementList.value.length

    deleteDialogVisible.value = false
    ElMessage.success('公告已删除')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
    console.error(error)
  }
}

// 更新紧急状态
const updateUrgentStatus = (row) => {
  try {
    // 模拟API调用
    console.log(`更新公告 ${row.id} 的紧急状态为: ${row.isUrgent}`)
    ElMessage.success('更新成功')
  } catch (error) {
    row.isUrgent = !row.isUrgent // 回滚
    ElMessage.error('更新失败')
    console.error(error)
  }
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
}

// 获取公告类型样式
const getTypeClass = (type) => {
  const map = {
    notice: 'bg-blue-100 text-blue-700',
    maintenance: 'bg-orange-100 text-orange-700',
    payment: 'bg-purple-100 text-purple-700',
    event: 'bg-green-100 text-green-700'
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

// 获取公告类型名称
const getTypeName = (type) => {
  const map = {
    notice: '通知',
    maintenance: '维修',
    payment: '缴费',
    event: '活动'
  }
  return map[type] || '其他'
}

// 初始化
onMounted(() => {
  fetchAnnouncements()
})
</script>

<style scoped>
.announcement-management-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>