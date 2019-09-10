<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item, index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="users[index].username">
              <!-- select可以忽略 -->
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="users[index].id">
              <!-- select可以忽略 -->
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <!-- 删除乘机人 -->
          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <!-- 添加乘机人 -->
      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in infoData.insurances" :key="index">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"
            border
            @change="handleChange(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 对象数据
      infoData: {},
      users: [
        {
          username: "",
          id: ""
        }
      ],
      //   保险数据id的集合
      insurances: [],
      contactName: "", // 联系人名字
      contactPhone: "", // 联系人电话
      invoice: false, // 是否需要发票
      seat_xid: "", // 座位id
      air: "", // 航班id
      captcha: "" // 验证码
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      // 给users添加多一项
      this.users.push({
        username: "",
        id: ""
      });
    },
    // 选中保险时触发
    handleChange(id) {
      // 先判断
      // this.insurances这个数组中原本的是否存在该id 如果存在 就不添加了
      const index = this.insurances.indexOf(id);
      if (index > -1) {
        // 出现-1就是该数组中不存在该数据
        // 这里是 > -1 所以是存在
        this.insurances.splice(index, 1);
      } else {
        this.insurances.push(id);
      }
      // console.log(id) //每次点击都会触发
      // this.insurances.push(id)
      // console.log(this.insurances)
    },
    // 移除乘机人
    handleDeleteUser(index) {
      // 把users中的某一项删除掉
      // 删除数组中某个元素使用splice，截取数组中的某一项时候使用slice
      this.users.splice(index, 1);
    },

    // 发送手机验证码
    handleSendCaptcha() {
      this.$axios({
        url: `/captchas`,
        method: "POST",
        data: {
          tel: this.contactPhone
        }
      }).then(res => {
        // console.log(res)
        // 使用对象的结构
        const { code } = res.data;
        // 提示信息
        this.$alert(`验证码已发送，注意查收`);
      });
    },
    // 提交订单
    handleSubmit() {
    //   console.log(this.users);
      const data = {
          users : this.users,
          insurances : this.insurances,
          contactName : this.contactName,
          contactPhone : this.contactPhone,
          invoice : this.invoice,
          seat_xid : this.$route.query.seat_xid,
          air : this.$route.query.id,
          captcha : this.captcha
      }
      this.$axios({
          url : '/airorders',
          method : 'POST',
        //   可以给接口单独加上请求头
          headers : { Authorization : `Bearer ${this.$store.state.user.userInfo.token}`},
          data
      })
      .then(res => {
          console.log(res)
      })
    }
  },
  mounted() {
    //   获取机票数据
    // 在路由中 将数据id和xid获取
    // 解构
    const { id, seat_xid } = this.$route.query;
    this.$axios({
      url: `/airs/${id}`,
      params: { seat_xid }
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        // 将整个数据的对象都存起来
        this.infoData = res.data;
      }
    });
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}
/deep/ .el-select .el-input {
  width: 130px;
}
.input-with-select {
  width: 590px;
}
.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}
.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;
  &:first-child {
    .delete-user {
      display: none;
    }
  }
}
.add-member {
  margin-top: 20px;
}
.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}
.insurance {
  > div {
    margin-top: 10px;
  }
}
.insurance-item {
  margin-bottom: 20px;
}
.contact {
  /deep/ .el-input {
    width: 50%;
  }
}
.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>