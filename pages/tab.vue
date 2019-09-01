<template>
  <div class="tabs">
    <div class="new">
      <span
        v-for="(item,index) in ['新闻','体育','娱乐']"
        :key="index"
        @click="handleClick(index)"
        :class="{ active : current === index }"
        class="ml"
      >{{item}}</span>
    </div>

    <div>
      <ul v-show="current === 0">
        <li>5G</li>
        <li>5G</li>
        <li>5G</li>
      </ul>
    </div>

    <div v-show="current === 1">
      <ul>
        <li>男足</li>
        <li>男足</li>
        <li>男足</li>
      </ul>
    </div>

    <div v-show="current === 2">
      <ul>
        <li>111</li>
        <li>111</li>
        <li>111</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 0
    };
  },
  methods: {
    handleClick(index) {
      this.current = index;
    }
  }
};
</script>

<style lang="less" scope>
.tabs {
    width: 200px;
    margin: 100px auto;
  .new {
    cursor: pointer;
  }
}
ul {
  padding: 0px;
  list-style: none;
}
.active {
  color: red;
}
.ml {
    margin-left: 10px
}
</style>