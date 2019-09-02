<template>
  <div class="header">
    <el-row type="flex" justify="space-between" class="container">
      <!-- logo -->
      <div class="logo">
        <img src="http://157.122.54.189:9093/images/logo.jpg" alt />
      </div>

      <!-- 导航 -->
      <div class="navs">
        <el-row type="flex">
          <nuxt-link to="/">首页</nuxt-link>
          <nuxt-link to="/post">旅游攻略</nuxt-link>
          <nuxt-link to="/hotel">酒店</nuxt-link>
          <nuxt-link to="/air">国内机票</nuxt-link>
        </el-row>
      </div>

      <!-- 登录 -->
      <div class="login">
        <nuxt-link to="/user/login">登录/注册</nuxt-link>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scope>
.header {
  background-color: #fff;
  height: 60px;
  line-height: 60px;
  width: 100%;
  border-bottom: 1px #ddd solid;
  box-shadow: 0 2px 2px #ddd;
}
.container{
  width: 1000px;
  margin: 0 auto;
}
.navs {
  flex:1;
  a{
    height: 60px;
    display: block;
    padding: 0 20px;
    box-sizing: border-box;
    &:hover{
      border-bottom: 5px #409eff solid;
      color: #409eff;
    }
  }
}
  // 当我的nuxt-link的to属性域url的路径相同的时候触发
  .nuxt-link-exact-active{
     background-color: #409eff;
     color: #fff
  }

.logo{
  padding-top: 9px;
  img{
    width: 156px;
    height: 42px;
    display: block;
  }
}

.login{
  font-size: 14px;
  a:hover{
    text-decoration: underline;
    color: #409eff
  }
}
</style>