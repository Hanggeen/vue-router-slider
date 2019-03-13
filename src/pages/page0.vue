<template>
  <div class="page page0">
    <h4 @click="$router.go(-1)">返回上一级</h4>
    <router-link to="/page1">Page1</router-link>
    <router-link to="/page2">Page2</router-link>
    <router-link to="/page3">Page3</router-link>
    <router-link to="/page4">Page4</router-link>
  </div>
</template>
