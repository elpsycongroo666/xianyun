<template>
  <el-form :model="registerForm" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名手机" v-model="registerForm.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <!-- 文档地址：https://element.eleme.cn/#/zh-CN/component/input#fu-he-xing-shu-ru-kuang -->
      <el-input placeholder="验证码" v-model="registerForm.captcha">
        <template slot="append">
          <el-button @click="captchaSend">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="registerForm.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="registerForm.password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
      <el-input placeholder="确认密码" type="password" v-model="registerForm.checkPassword"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary">注册</el-button>
  </el-form>
</template>

<script>
export default {
    data(){
        // rule当前的规则，目前是空的
        // value输入框的值
        // callback是回调函数，必须要调用
        const checkPassword = (rule,value,callback) => {
            if(value === ''){
                callback(new Error('请输入密码'))
            }else if (value !== this.registerForm.password){
                callback(new Error('两次输入密码不一致!'))
            }else{
                // 代表验证通过
                callback();
            }
        }
        return{
            registerForm : {
                username : '',
                nickname : '',
                captcha : '',
                password : '',
                checkPassword :''
            },
             rules : {
                username : [
                    { required : true, message : '请输入用户名' ,trigger : 'blur' }
                ],
                nickname : [
                    { required : true, message : '请输入昵称' ,trigger : 'blur' }
                ],
                captcha : [
                    { required : true, message : '请输入验证码' ,trigger : 'blur' }
                ],
                password : [
                    { required : true, message : '请输入密码' ,trigger : 'blur' }
                ],
                checkPassword : [
                    { validator : checkPassword , tirgger : 'blur' }
                ]
            }
        }
    },
    methods : {
        // 发送验证码
        captchaSend(){
            this.$axios({
                url : `/captchas`,
                method : 'POST',
                data : {
                    tel : this.registerForm.username
                }
            }).then((res)=>{
                // console.log(res)
                // 使用对象的结构
                const {code} = res.data
                // 提示信息
                this.$alert(`验证码已发送，注意查收`)
            })
        }
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