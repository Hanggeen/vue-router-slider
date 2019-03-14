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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
}
.content {
  margin: 5vh 10vw;
  width: 80vw;
  height: 90vh;
}

.page {
  text-align: center;
  width: 100%;
  min-height: 100vh;
  padding-top: 20px;
}
h4 {
  color: #ffffff;
}
a,p {
  display: block;
  color: #fff;
  font-size: 20px;
  margin: 10px 10px;
  text-decoration: none;
}
.page0 {
  background-color: hsl(0, 93%, 83%)
}
.page1 {
  background-color: hsl(197, 95%, 83%)
}
.page2 {
  background-color: hsl(133, 93%, 83%)
}
.page3 {
  background-color: hsl(55, 85%, 68%)
}
.page4 {
  background-color: hsl(315, 93%, 83%)
}
</style>
