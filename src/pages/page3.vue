<template>
  <div class="page page3">
    <div class="top">
      <a href="https://github.com/Hanggeen/vue-router-slider">
        <div class="logo"></div>
        <!-- <img src="https://cn.vuejs.org/images/logo.png" alt=""> -->
        <span>vue-router-slider</span>
      </a>
    </div>
    <p>Vue单页面路由滑动插件，支持手势返回</p>
    <p class="title">当前页面：Page3 <span>当前堆栈:{{stack}}</span></p>
    <div class="links">
      <p>你可以点击下面前往其他page</p>
      <router-link to="/">Page0</router-link>
      <router-link to="/page1">Page1</router-link>
      <router-link to="/page2">Page2</router-link>
      <p>Page3</p>
      <router-link to="/page4">Page4</router-link>
      <p @click="$router.go(-1)" v-if="stack !== 0">返回上一级</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['slotProps'],
  data: function () {
    return {
      stack: this.slotProps.stack
    }
  }
}
</script>
