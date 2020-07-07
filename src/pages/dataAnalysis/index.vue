<template>
  <el-container>
    <el-aside width="300px">
      <div id="mune-title">
        菜单
        <i class="right iconfont icon-caidan"></i>
      </div>
      <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @select="selectItems">
         <el-menu-item v-for="route in routes" :key="route.path" :item="route" :index="route.name">
          <i class="iconfont icon-yuanquan"></i>
          <span slot="title">{{route.meta.title}}</span>
        </el-menu-item>
      </el-menu>
      
    </el-aside>
    <el-main id="main-div">
      <router-view :key=key></router-view>
    </el-main>
  </el-container>
</template>

<script>
import routerUtil from "@/utils/routerUtil";
import path from 'path'

export default {
  name: "dataAnalysis",
  data() {
    return { 
      activeMenu:''

    };
  },
  computed: {
    key() { 
      let router = this.$route
      this.activeMenu = router.name
      return router.path
    },
    routes() {
      let routers = this.$router.options.routes
      return routerUtil.getRouter('dataAnalysis',routers).children
    }
  },
  methods: {
    selectItems(key) {
      this.$router.push('/dataAnalysis/'+key)
    }
  }
};
</script>

<style lang="scss" scoped>
.el-menu {
  margin: 0 10px;
  background: none;
  border-right: none;
}
.el-container {
  height: 100%;
}
.el-aside {
  border-right: 1px solid #495b83;
}
.el-menu-item {
  color: #7f97bd;
}
.el-menu-item.is-active {
  color: #409eff;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background: none;
  border: 1px solid #495b83;
}
.el-main {
  color: #7f97bd;
}
#mune-title {
  height: 40px;
  line-height: 40px;
  font-size: 17px;
  padding: 0 20px;
  border-bottom: 1px solid #495b83;
  color: #7f97bd;
  margin-bottom: 10px;
  i {
    font-size: 20px;
    cursor: pointer;
  }
}
.el-menu-item i {
  margin-right: 10px;
}
</style>

