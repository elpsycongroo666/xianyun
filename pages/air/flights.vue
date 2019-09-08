<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <filghtsFilters :data="filghtsData"/> 

        <!-- 航班头部布局 -->
        <filghtsHeader />

        <!-- 航班信息 -->
        <filghtsList v-for="item in dataList" :key="item.id" :data="item" />

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
import filghtsFilters from '@/components/air/filghtsFilters.vue'
export default {
  data() {
    return {
      // 数据如果是一次全部返回的情况下，那么我们就要先用一个对象先将所有的数据存储起来，在新建一个数组，获取特定情况下的数据给这个数组
      filghtsData: { //这里的filghtsData是有四个对象的 分别是info/flights/options/total
        info : {}, //为什么要加这个info 给一个初始化的空对象? 因为我们获取数据是一个异步操作，并不知道什么时候才能拿回结果 ，如果不先定义一个空的对象的话 那么那边锁需要的这个info对象 就会是没定义的 固然里面的值也都是undefined 所以要先定义一个空的
        options : {} // options 同理

      },
      dataList : [],
      data: {},
      total : 0,
      pageSize : 5,
      pageIndex : 1
    };
  },
  components: {
    filghtsHeader,
    filghtsList,
    filghtsFilters
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
        this.dataList = res.data.flights.slice(0,this.pageSize) //取到4 不到5        
      } else {
        this.$message.error("数据获取失败");
      }
    });
  },
  methods: {
    // 封装切换页码和切换显示条数的方法
    setDataList(){
      const start = (this.pageIndex -1) * this.pageSize
      const end = start + this.pageSize
      this.dataList = this.filghtsData.flights.slice(start,end)
    },
    // 当且页码
    handleCurrentChange(val) {
      // 修改当前页码的值
      this.pageIndex = val
      // 调用封装好的方法
      this.setDataList()

      // 按照数学公式，切换filghtsData 数据
      // this.dataList = this.filghtsData.flights.slice((this.pageIndex - 1) * this.pageSize , this.pageIndex * this.pageSize) 
    },

    // 每页展示多少条数据
    handleSizeChange(val) {
    // 修改当前要显示的数据条数
    this.pageSize = val
    // 修改当前页展示数据后 返回第一页
    this.pageIndex = 1
    // 调用封装好的方法
    this.setDataList()


    // this.dataList = this.filghtsData.flights.slice(0,val)

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