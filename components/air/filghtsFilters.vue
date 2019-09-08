<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            v-for="(item,index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            v-for="(item,index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
          <el-option
            v-for="(item,index) in airSizeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", // 机型大小
      airSizeList: [
        { label: "大", value: "L" },
        { label: "中", value: "M" },
        { label: "小", value: "S" }
      ]
    };
  },
  props: {
    data: {
      type: Object,
      default: {} //给这个data一个默认值 默认值为空对象
    }
  },
  methods: {
    // 选择机场时候触发
    handleAirport(value) {
        const arr = this.data.flights.filter(v => { // (this.data.flights) = (:data="cacheFlights")
            return v.org_airport_name === value
        })
        // console.log(arr)
        this.$emit('setDataList', arr)
    },

    // 选择出发时间时候触发
    handleFlightTimes(value) {
        console.log(value)
        // 数组的解构赋值 const [from,to] = [6,2]
        const [from, to] = value.split(",");
        // console.log(from,to)
        // console.log(this.data,123)
        // 过滤数据，只保留选中的出发时间航班
        const arrList = this.data.flights.filter(v => {

            // 每趟航班的出发时间的小时
            const current = v.dep_time.split(":")[0]
            // console.log(current,111)
            // 需要满足在时间段内 比如 6 - 12;
            return +current >= +from && +current < +to;
        })
        console.log(arrList)

        this.$emit('setDataList',arrList)
    },

    // 选择航空公司时候触发
    handleCompany(value) {
        
        // 过滤数据，只保留选中的航空公司的航班
        const arr = this.data.flights.filter(v => {
            return v.airline_name === value
        })
        console.log(arr)
        this.$emit('setDataList',arr)
    },

    // 选择机型时候触发
    handleAirSize(value) {
        console.log(value)
        const arr = this.data.flights.filter(v => {
            return v.plane_size === value
        })
        this.$emit('setDataList',arr)
    },

    // 撤销条件时候触发
    handleFiltersCancel() {
        
    }
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>