<template>
  <div>
    <vue-router-slide class="content">
      <template slot-scope="slotProps">
        <router-view v-bind:slotProps="slotProps"></router-view>
      </template>
    </vue-router-slide>
  </div>
</template>

<script>
import Velocity from 'velocity-animate'
import VueRouterSlide from '@/plugin/vue-router-slide/vue-router-slide'
export default {
  name: 'App',
  components: {
    VueRouterSlide
  },
  data () {
    return {
    }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
input,
button,
div {
  outline: 0;
}

a,
img,
button,
input,
textarea,
div {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

input,
textarea {
  -webkit-appearance: none;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.content {
  width: 100vw;
  height: 100vh;
}


/* 子路由样式 */
.page {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  width: 100%;
  height: 100vh;
  color: #3e5268;
  box-shadow: -5px 0px 10px rgba(0,0,0, .1);
  background-color: #fff;
  text-align: center;
  font-size: 14px;
}
.page > .top {
  margin-bottom: 20px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  box-shadow: 0px 0px 10px rgba(0,0,0, .1);
}
.page > .top a{
  text-decoration: none;
  color: #2c3e50;
}
.page > .top .logo {
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  height: 30px;
  background-image: url(https://cn.vuejs.org/images/logo.png);
  background-size: 100% 100%;
}
.page > .top span {
  vertical-align: middle;
  font-size: 16px;
  color: #3e5268;
}
.page > .title > span{
  margin-left: 20px;
}
.page  > .title{
  margin-top: 40px;
}
.page > .links > a,
.title,
.links > p {
  display: block;
  font-size: 14px;
  margin: 15px 40px;
}
.page > .links > a {
  color: #42b983
}
.links > p:last-child {
  margin-top: 50px;
}
</style>
