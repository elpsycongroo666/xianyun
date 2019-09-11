<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{order.price}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
export default {
  data() {
    return {
      // 订单详情
      order: {},
      // 定时器的变量
      timer: null
    };
  },
  mounted() {
    // 这个方法是有缺陷的，不是100%准确
    // userInfo在页面加载完成才赋值
    const { id } = this.$route.query;
    setTimeout(v => {
      this.$axios({
        url: `/airorders/${id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      }).then(res => {
        // console.log(res)
        const { payInfo } = res.data;
        // 存储一个大的数据对象
        this.order = res.data;
        // 生成二维码到canvas
        const stage = document.querySelector("#qrcode-stage");
        QRCode.toCanvas(stage, payInfo.code_url, {
          width: 300
        });
        // 轮询，每隔3秒钟就查询
        this.timer = setInterval(()=>{
          this.getPayStatus();
        },3000)
      });
    }, 200);
  },
   // 组件卸载时候触发
  destroyed(){
            // 当我们切换到其他页面的时候 请求也还在继续 所以我们要清除请求
      clearInterval(this.timer);
      this.timer = null
  },
  methods: {
    // 获取当前支付状态
    getPayStatus() {
      this.$axios({
        url: "/airorders/checkpay",
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        },
        method: "post",
        data: {
          id: this.$route.query,
          nonce_str: this.order.price,
          out_trade_no: this.order.orderNo
        }
      }).then(res => {
        console.log(res, 123);
        const { statusTxt } = res.data
        // statusTxt === "支付完成" 清除定时器
        if(statusTxt === '支付完成'){
          clearInterval(this.timer);
          this.timer = null;

          // 提示用户支付成功
          this.$alert('支付成功','提示')
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>