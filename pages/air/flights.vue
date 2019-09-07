<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->
        <filghtsHeader/>

        <!-- 航班信息 -->
        <filghtsList v-for="(item,index) in filghtsData"
        :key="index" :data="item"/>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import filghtsHeader from '@/components/air/filghtsheader.vue'
import filghtsList from '@/components/air/filghtslist.vue'
export default {
  data() {
    return {
      filghtsData: [],
      data : {}
    };
  },
  components : {
    filghtsHeader,filghtsList
  },
   mounted() {
    // 返回的是一个对象
    // 请求机票列表数据
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        this.filghtsData = res.data.flights;
      } else {
        this.$message.error("数据获取失败");
      }
    });
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>