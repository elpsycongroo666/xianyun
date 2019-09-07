<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->
        <filghtsHeader />

        <!-- 航班信息 -->
        <filghtsList v-for="(item,index) in dataList" :key="index" :data="item" />

        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import filghtsHeader from "@/components/air/filghtsheader.vue";
import filghtsList from "@/components/air/filghtslist.vue";
export default {
  data() {
    return {
      // 数据如果是一次全部返回的情况下，那么我们就要先用一个对象先将所有的数据存储起来，在新建一个数组，获取特定情况下的数据给这个数组
      filghtsData: {},
      dataList : [],
      data: {},
      total : 0,
      pageSize : 5,
      pageIndex : 1
    };
  },
  components: {
    filghtsHeader,
    filghtsList
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
        this.filghtsData = res.data
        // 数据的总数
        this.total = this.filghtsData.flights.length
        // 获取第一页的值
        this.dataList = res.data.flights.slice(0,5) //取到4 不到5        
      } else {
        this.$message.error("数据获取失败");
      }
    });
  },
  methods: {
    // 当且页码
    handleCurrentChange(val) {
      // 修改当前页码的值
      this.pageIndex = val

      // 按照数学公式，切换filghtsData 数据
      this.dataList = this.filghtsData.flights.slice((this.pageIndex - 1) * this.pageSize , this.pageIndex * this.pageSize) 
    },

    // 每页展示多少条数据
    handleSizeChange(val) {


    }
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