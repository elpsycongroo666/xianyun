<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <flightsFilters :data="cacheFlightsData" @setDataList="setDataList" />

        <!-- 航班头部布局 -->
        <flightsHeader />

        <!-- 航班信息 -->
        <flightsList v-for="item in dataList" :key="item.id" :data="item" />

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
      <flightsAside />
    </el-row>
  </section>
</template>

<script>
import flightsHeader from "@/components/air/flightsHeader.vue";
import flightsList from "@/components/air/flightsList.vue";
import flightsFilters from "@/components/air/flightsFilters.vue";
import flightsAside from "@/components/air/flightsAside.vue";
export default {
  data() {
    return {
      // 数据如果是一次全部返回的情况下，那么我们就要先用一个对象先将所有的数据存储起来，在新建一个数组，获取特定情况下的数据给这个数组
      flightsData: {
        //这里的filghtsData是有四个对象的 分别是info/flights/options/total
        info: {}, //为什么要加这个info 给一个初始化的空对象? 因为我们获取数据是一个异步操作，并不知道什么时候才能拿回结果 ，如果不先定义一个空的对象的话 那么那边锁需要的这个info对象 就会是没定义的 固然里面的值也都是undefined 所以要先定义一个空的
        options: {} // options 同理
      },
      cacheFlightsData: {
        info: {},
        options: {}
      },
      dataList: [],
      data: {},
      total: 0,
      pageSize: 5,
      pageIndex: 1
    }
  },
  components: {
    flightsHeader,
    flightsList,
    flightsFilters,
    flightsAside
  },
  watch : {
    $route(){
      this.getData()
    }
  },
  mounted() {
    // 返回的是一个对象
    this.getData()
  },
  methods: {
    getData() {
      // 请求机票列表数据
      this.$axios({
        url: "/airs",
        params: this.$route.query
      }).then(res => {
        console.log(res);
        if (res.status === 200) {
          // 赋值给总数据
          this.flightsData = res.data;

          // 赋值给缓存总数据
          this.cacheFlightsData = { ...res.data }; // 深拷贝 将原来的数据进行深拷贝 使得每次筛选的时候 数据都是一样的 不会被覆盖

          // 数据的总数
          this.total = this.flightsData.flights.length;
          // 获取第一页的值
          this.dataList = res.data.flights.slice(0, this.pageSize); //取到4 不到5
        } else {
          this.$message.error("数据获取失败");
        }
      });
    },
    // 封装切换页码和切换显示条数的方法
    // 该方法传递给子组件，用于修改dataList
    setDataList(arr) {
      this.flightsData.flights = arr;

      // 按照数学公式切换dataList 的值
      this.dataList = this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      console.log(this.dataList);
      this.total = arr.length;
    },
    // 每页条数切换时候触发, val是条数
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(this.flightsData.flights, 123);

      // 重新回到第一页
      this.pageIndex = 1;

      // this.pageIndex = 1;
      // 按照数学公式切换dataList的值
      this.dataList = this.flightsData.flights.slice(0, val);
    },
    // 页码切换时候触发, val是点击的页码
    handleCurrentChange(val) {
      this.pageIndex = val; // 当前页

      // 按照数学公式切换dataList的值
      this.dataList = this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
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