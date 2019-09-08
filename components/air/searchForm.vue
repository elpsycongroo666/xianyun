<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <!-- 出发城市的远程搜索 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          v-model="form.departCity"
          @blur="blurDepart"
        ></el-autocomplete>
      </el-form-item>
      <!-- 到达城市的远程搜索 -->
      <el-form-item label="到达城市">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
          v-model="form.destCity"
          @blur="blurDest"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          v-model="form.departDate"
        ></el-date-picker>
      </el-form-item>
      <!-- 搜索按钮 -->
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      form: {
        departCity: "",
        departCode: "",
        destCity: "",
        destCode: "",
        departDate: ""
      },
      departData: [],
      destData: []
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(index) {
      if (index === 1) {
        this.$alert("暂时不支持往返", "提示");
      }
    },

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    // cb调用的时必须要接受一个数组，数组中的元素必须是一个对象，对象中必须有value属性
    queryDepartSearch(value, cb) {
      // 当输入框为空的时候 就不发送请求
      if (!value) {
        // 并且将下面的搜索内容隐藏
        cb([]);
        // 不发送请求
        return false;
      }
      this.$axios({
        url: "/airs/city",
        params: { name: value }
      }).then(res => {
        // 解构出数组
        const { data } = res.data;

        // 给每个数组添加
        var newArr = [];
        data.forEach(v => {
          v.value = v.name.replace("市", "");
          // 把带有value属性的对象添加到新数组中
          newArr.push(v);
        });
        // 如果用户只是输入了数据 并没有点击下拉选择的时候 我们就无法获得城市名字和城市代码 不符合我们的需求
        // 那么我们就要在他输入之后 就将数据获取到 给一个默认的城市代码和城市名字
        // 默认选中的话 会引起bug 比如 输入广州 然后 删除州  会默认帮用户选中广州

        // 把转换后的数组 赋值给departData
        this.departData = newArr;
        console.log(this.departData[0].value);
        cb(newArr);
      });
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      // 当输入框为空的时候 就不发送请求
      if (!value) {
        // 并且将下面的搜索内容隐藏
        cb([]);
        // 不发送请求
        return false;
      }
      this.$axios({
        url: "/airs/city",
        params: { name: value }
      }).then(res => {
        // 解构出数组
        const { data } = res.data;

        // 给每个数组添加
        var newArr = [];
        data.forEach(v => {
          v.value = v.name.replace("市", "");
          // 把带有value属性的对象添加到新数组中
          newArr.push(v);
        });
        // 默认选中会有bug
        // this.form.destCity = newArr[0].value;
        // this.form.destCode = newArr[0].sort;
        // 把转换后的数组 赋值给departData
        this.destData = newArr;
        cb(newArr);
      });
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      console.log(item);
      this.form.departCode = item.sort;
      this.form.departCity = item.value;
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCode = item.sort;
      this.form.destCity = item.value;
    },

    // 确认选择日期时触发
    handleDate(value) {
      //    console.log(value)
      //    console.log(moment(value).format('YYYY-MM-DD'))
      this.form.departDate = moment(value).format("YYYY-MM-DD");
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      // 结构出原来的数据
      const { departCity, departCode, destCity, destCode } = this.form;
      // 不能直接 this.form.departCity = this.form.destCity 不然会导致数据一样 无法切换 要先获取到原来的
      this.form.departCity = destCity;
      this.form.departCode = destCode;
      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },

    // 提交表单是触发
    handleSubmit() {
      const { departCity, destCity, departDate } = this.form;
      // 先判断是否选择了出发城市 如果有出发城市的话 自然也会有该城市的代码
      if (!departCity) {
        this.$alert("出发城市不能为空", "提示");
        return;
      }
      // 判断目标城市
      if (!destCity) {
        this.$alert("目标城市不能为空", "提示");
        return;
      }
      // 判断出发时间
      if (!departDate) {
        this.$alert("请选择出发时间", "提示");
        return;
      }
      // console.log(this.form)
      // 把本地存储先拿出来
      const arr = JSON.parse(localStorage.getItem('airs')) || [];
      arr.push(this.form);

      // 把搜索的条件保存到本地
      localStorage.setItem('airs',JSON.stringify(arr))

      // 跳转到机票列表页面 /air/flights
      this.$router.push({
        path: "/air/flights",
        // url 携带的参数
        query: this.form
      });
    },

    // 出发城市的失焦事件 解决bug
    blurDepart() {
      if(!this.departData[0].value){
          this.departData = []
          return
      }
      this.form.departCity = this.departData[0].value ? this.departData[0].value : ""
      this.form.departCode = this.departData[0].sort ? this.departData[0].sort : ""
    },
    // 目标城市的失焦事件
    blurDest() {
      if (!this.destData[0].value) {
        this.destData = []
        return
      }
      this.form.destCity = this.destData[0].value ? this.destData[0].value : ""
      this.form.destCode = this.destData[0].sort ? this.destData[0].sort : ""
    },
    mounted() {}
  }
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>