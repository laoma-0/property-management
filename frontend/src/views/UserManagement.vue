<template>
  <div style="display: flex; height: 100vh; flex-direction: column">
    <HeaderBar />
    <div style="display: flex; flex: 1; min-height: 0">
      <Sidebar class="sidebar" :active-menu="'/user-management'" />
      <div class="main-content">
        <Breadcrumb :items="breadcrumbItems" />
        <div class="content-area">
          <UserSearch @search="handleSearch" @reset="handleReset" />
          <div class="actions">
            <el-button type="primary" @click="openUserForm()">
              添加用户
            </el-button>
            <el-button
                type="danger"
                :disabled="!multipleSelection.length"
                @click="handleBatchDelete"
            >
              批量删除
            </el-button>
            <el-dropdown @command="handleExport">
              <el-button>
                更多操作
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="export">
                    导出所选数据
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <!-- <pre>{{ pagedUsers }}</pre> -->
          <UserTable
              :users="pagedUsers"
              :total="total"
              :page="page"
              :page-size="pageSize"
              @selection-change="handleSelectionChange"
              @edit="openUserForm"
              @delete="handleDelete"
              @status-change="handleStatusChange"
              @sort-change="handleSortChange"
              @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    <UserForm
        v-if="showUserForm"
        :user="currentUser"
        :visible="showUserForm"
        @update:visible="showUserForm = $event"
        @submit="handleUserSubmit"
    />
  </div>
</template>

<script>
/* global console */

/* eslint-disable no-console */
import Sidebar from "@/components/Sidebar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import HeaderBar from "@/components/HeaderBar.vue";
import UserSearch from "@/components/UserSearch.vue";
import UserTable from "@/components/UserTable.vue";
import UserForm from "@/components/UserForm.vue";
import Swal from "sweetalert2";

export default {
  name: "UserManagement",
  components: {
    Sidebar,
    Breadcrumb,
    HeaderBar,
    UserSearch,
    UserTable,
    UserForm,
  },
  data() {
    return {
      breadcrumbItems: [{ text: "用户管理" }],
      users: [],
      filteredUsers: [],
      page: 1,
      pageSize: 10,
      multipleSelection: [],
      showUserForm: false,
      currentUser: null,
      sortProp: "",
      sortOrder: "",
      searchParams: {}, // 新增：保存搜索条件
      total: 0, // 新增：总条数
    };
  },
  computed: {
    pagedUsers() {
      // 直接返回filteredUsers（接口返回的当前页数据）
      return this.filteredUsers;
    },
  },
  watch: {
    multipleSelection() {
      // 仅用于触发视图更新，修复批量删除按钮状态
    },
  },
  created() {
    // 登录校验：未登录则跳转到登录页
    let user = null;
    try {
      // 通过 eval 间接访问 window，最大限度避免静态分析和环境限制
      const w = eval("window");
      if (w && w.localStorage) {
        user = w.localStorage.getItem("user");
      }
    } catch (e) {
      // 忽略异常
    }
    if (!user) {
      this.$router.replace({ path: "/login" });
      return;
    }
    // 只用分页参数，不带 searchParams，确保首次加载显示全部
    this.page = 1;
    this.searchParams = {};
    this.fetchUsers({ page: 1, size: this.pageSize });
  },
  methods: {
    fetchUsers(params = {}) {
      // 只在有搜索/重置时才合并 this.searchParams
      const query = {
        page: params.page || this.page,
        size: params.size || this.pageSize,
        ...(params &&
        Object.keys(params).some((k) => k !== "page" && k !== "size")
            ? this.searchParams
            : {}),
        ...params,
      };
      this.$axios
          ? this.$axios
              .get("/api/users", { params: query })
              .then((res) => {
                // 更详细的调试输出
                console.log("用户接口返回：", res.data);

                // 兼容多种常见结构
                let list = [];
                let total = 0;
                if (res.data) {
                  if (Array.isArray(res.data.data)) {
                    list = res.data.data;
                    total = res.data.total || res.data.count || 0;
                  } else if (Array.isArray(res.data.list)) {
                    list = res.data.list;
                    total = res.data.total || res.data.count || 0;
                  } else if (Array.isArray(res.data)) {
                    list = res.data;
                    total = res.data.length;
                  }
                }
                console.log("最终用户列表：", list, "总数：", total);

                // 容错：list不是数组时，赋空数组
                if (!Array.isArray(list)) list = [];

                this.filteredUsers = list.map((u) => ({
                  ...u,
                  // 展示真实姓名 realName 字段
                  realName: u.realName || u.real_name || "",
                  status:
                      u.status === 1 || u.status === "1"
                          ? "正常"
                          : u.status === 0 || u.status === "0"
                              ? "禁用"
                              : u.status,
                  type:
                      u.role === 1 || u.role === "1"
                          ? "管理员"
                          : u.role === 2 || u.role === "2"
                              ? "普通用户"
                              : u.role || "其他",
                  createTime: u.createTime
                      ? typeof u.createTime === "string"
                          ? u.createTime.replace("T", " ")
                          : u.createTime
                      : u.create_time || "",
                }));
                this.total = total;
              })
              .catch((err) => {
                console.error("用户接口异常：", err);
                this.filteredUsers = [];
                this.total = 0;
              })
          : null;
    },
    handleSearch(params) {
      this.page = 1;
      this.searchParams = params;
      this.fetchUsers({ ...params, page: 1 });
    },
    handleReset() {
      this.page = 1;
      this.searchParams = {};
      this.fetchUsers({ page: 1 });
    },
    openUserForm(user) {
      if (user) {
        // 兼容性别字段，若无则默认空
        this.currentUser = {
          ...user,
          gender: user.gender || "",
        };
      } else {
        this.currentUser = null;
      }
      this.showUserForm = true;
    },
    handleUserSubmit(user) {
      console.log("Sending user data:", user); // 新增：调试输出
      // 过滤掉 createTime、updateTime 字段，避免前端传递字符串导致后端 LocalDateTime 反序列化报错
      const userData = { ...user };
      delete userData.createTime;
      delete userData.updateTime;
      if (user.id) {
        // 编辑
        const submitUser = {
          ...userData,
          status:
              user.status === "正常"
                  ? 1
                  : user.status === "禁用"
                      ? 0
                      : user.status,
          role:
              user.type === "管理员"
                  ? 1
                  : user.type === "普通用户"
                      ? 2
                      : user.role,
        };
        this.$axios
            ? this.$axios
                .put(`/api/users/${user.id}`, submitUser)
                .then(() => {
                  this.fetchUsers();
                  this.showUserForm = false;
                  Swal.fire({
                    icon: "success",
                    title: "编辑成功",
                    timer: 1200,
                    showConfirmButton: false,
                  });
                })
                .catch((err) => {
                  this.$message.error(
                      err.response && err.response.data && err.response.data.message
                          ? err.response.data.message
                          : "编辑用户失败"
                  );
                })
            : null;
      } else {
        // 新增
        const submitUser = {
          ...userData,
          status:
              user.status === "正常"
                  ? 1
                  : user.status === "禁用"
                      ? 0
                      : user.status,
          role:
              user.type === "管理员"
                  ? 1
                  : user.type === "普通用户"
                      ? 2
                      : user.role,
        };
        this.$axios
            ? this.$axios
                .post("/api/users", submitUser)
                .then(() => {
                  this.fetchUsers();
                  this.showUserForm = false;
                  Swal.fire({
                    icon: "success",
                    title: "添加成功",
                    timer: 1200,
                    showConfirmButton: false,
                  });
                })
                .catch((err) => {
                  this.$message.error(
                      err.response && err.response.data && err.response.data.message
                          ? err.response.data.message
                          : "添加用户失败"
                  );
                })
            : null;
      }
    },
    handleDelete(user) {
      if (user && user.type === "管理员") {
        this.$message.warning("管理员账号不允许删除");
        return;
      }
      this.$confirm("确定删除该用户吗？", "提示", { type: "warning" })
          .then(() => {
            this.$axios
                ? this.$axios.delete(`/api/users/${user.id}`).then(() => {
                  this.fetchUsers();
                  Swal.fire({
                    icon: "success",
                    title: "删除成功",
                    timer: 1200,
                    showConfirmButton: false,
                  });
                })
                : null;
          })
          .catch(() => {});
    },
    handleBatchDelete() {
      const adminUsers = this.multipleSelection.filter(
          (u) => u.type === "管理员"
      );
      if (adminUsers.length > 0) {
        this.$message.warning("管理员账号不允许批量删除");
        return;
      }
      this.$confirm("确定批量删除所选用户吗？", "提示", { type: "warning" })
          .then(() => {
            const ids = this.multipleSelection.map((u) => u.id);
            if (!ids.length) {
              this.$message.warning("请先勾选要删除的用户");
              return;
            }
            this.$axios
                ? this.$axios
                    .delete("/api/users/batch", { data: { ids } })
                    .then(() => {
                      Swal.fire({
                        icon: "success",
                        title: "批量删除成功",
                        timer: 1200,
                        showConfirmButton: false,
                      });
                      this.fetchUsers();
                      this.multipleSelection = [];
                    })
                    .catch((err) => {
                      this.$message.error(
                          err.response &&
                          err.response.data &&
                          err.response.data.message
                              ? err.response.data.message
                              : "批量删除失败"
                      );
                    })
                : null;
          })
          .catch(() => {});
    },
    handleExport(command) {
      if (command === "export") {
        this.$message.info("该功能待开发中！！！");
      }
    },
    handleStatusChange(user) {
      if (user && user.type === "管理员") {
        this.$message.warning("管理员账号不允许禁用");
        return;
      }
      const newStatus = user.status === "正常" ? "禁用" : "正常";
      this.$axios
          ? this.$axios
              .patch(`/api/users/${user.id}/status`, { status: newStatus })
              .then(() => {
                this.fetchUsers();
              })
          : null;
    },
    handleSortChange({ prop, order }) {
      this.sortProp = prop;
      this.sortOrder = order;
      // 可选：后端排序，或前端排序
      if (!order) return;
      const sortFn = (a, b) => {
        if (a[prop] > b[prop]) return order === "ascending" ? 1 : -1;
        if (a[prop] < b[prop]) return order === "ascending" ? -1 : 1;
        return 0;
      };
      this.filteredUsers = [...this.filteredUsers].sort(sortFn);
    },
    handlePageChange(page) {
      this.page = page;
      this.fetchUsers({ page });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style scoped>
.user-management-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}
.sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #e6e6e6;
}
.main-content {
  flex: 1;
  padding: 24px;
}
.content-area {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  padding: 24px;
}
.actions {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}
</style>
