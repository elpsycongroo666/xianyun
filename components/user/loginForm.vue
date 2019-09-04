<template>
  <el-form :model="loginform" ref="loginform" :rules="rules" class="form" @keypress.enter.native="submitbtn">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="loginform.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="loginform.password"></el-input>
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="submitbtn">登录</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
        // 表单数据 用户名和密码
        loginform : {
            username : '',
            password : ''
        },
        // 表单规则
        rules : {
            username : [
                { required : true, message : '请输入用户名', trigger : 'blur'}
            ],
            password : [
                { required : true, message : '请输入密码', trigger : 'blur'}
            ]
        }
    };
  },
  methods : {
    //  登录事件
      submitbtn(){
        //   二次判断
          this.$refs.loginform.validate((valid)=>{
              if(valid){
                //   登录验证请求
                  this.$axios({
                      url : 'accounts/login',
                      method : 'POST', //method 没有s
                      data : this.loginform
                  })
                  .then((res)=>{
                      console.log(res)
                    if(res.status === 200){
                      // commit接收两个参数，第一个是mutations参数的方法名，第二个是传递的参数
                      this.$store.commit('user/setUserInfo',res.data)
                        // this.$message.success('登录成功，正在跳转')
                        // this.$router.push({path : '/'})
                    }else{
                        this.$message.error('用户名或密码错误')
                    }
                  })
                  .catch((err)=>{
                      console.log(err)
                  })
              }else{
                  this.$message.warning('请输入用户名或密码')
              }
          })
      }
  },
  mounted(){
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}
.form-item {
  margin-bottom: 20px;
}
.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}
.submit {
  width: 100%;
  margin-top: 10px;
}
</style>