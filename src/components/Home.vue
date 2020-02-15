<template>
  <el-container class="home-container">

    <el-header>
      <div class="logo-box">
        <img src="../assets/logo.png" alt="vue">
      </div>
      <el-button type="default" plain @click="exit">Sign out</el-button>
    </el-header>

    <el-container>
      <el-aside :width="!collapse?'200px':'64px'">
        <div class="toggle-button" @click="toggle">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="collapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="navState('/' + subitem.path)">
              <template slot="title">
                <i :class="subicons[subitem.id]"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        menuList: [],
        icons: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-role_icon',
          '101': 'iconfont icon-goods',
          '102': 'iconfont icon-zhenhuichongtubiaozhizuo-kuozhan-',
          '145': 'iconfont icon-data'
        },
        subicons: {
          '110': 'iconfont icon-user1',
          '111': 'iconfont icon-list',
          '112': 'iconfont icon-ic_opt_feature',
          '104': 'iconfont icon-goods',
          '115': 'iconfont icon-zhenhuichongtubiaozhizuo-kuozhan-',
          '121': 'iconfont icon-category',
          '107': 'iconfont icon-details',
          '146': 'iconfont icon-echarts_line'
        },
        // 菜单折叠展开
        collapse: false,
        // 被激活的菜单
        activePath: ''
      }
    },
    methods: {
      exit() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // 获取侧边栏菜单数据
      async getMenuList() {
        const { data:res } = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
        this.menuList = res.data
      },
      // 切换菜单折叠
      toggle() {
        this.collapse = !this.collapse
      },
      // 链接激活状态
      navState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;

    .el-header {
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 0;
      color: rgba(0,0,0,.5);
      font-size: 20px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

      .logo-box {
        /*width: 200px;*/
        /*height: 100%;*/
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          height: 100%;
        }
      }
    }
    .el-aside {
      background-color: #333744;
      user-select: none;
      transition: width .35s;

      .iconfont {
        margin-right: 10px;
      }
      .el-menu {
        border-right: none;
      }
      .toggle-button {
        background-color: #4f5064;
        font-size: 16px;
        line-height: 30px;
        color: #ffffff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
      }
    }
    .el-main {
      background-color: #eaedf1;
    }
  }
  @media (min-width: 1200px) {
    .el-header {
      .logo-box {
        width: 200px;
        height: 100%;
      }
    }
  }
  @media (max-width: 480px) {
    .el-header {
      .logo-box {
        width: 160px;
        height: 80%;
      }
    }
    .el-aside {
      /*width: 48px !important;*/
    }
  }
</style>