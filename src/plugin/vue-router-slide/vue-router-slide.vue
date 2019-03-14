<template>
  <div class="vue-router-slide"
    ref="vueRuterSlide"
    @touchstart='touchStart'
    @touchmove='touchMove'
    @touchend='touchEnd'>
    <transition
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
      v-on:after-leave="afterLeave"
      v-bind:css="false">
      <slot v-bind:stack="stack"></slot>
    </transition>
  </div>
</template>
<script>
export default {
  data () {
    return {
      startX: 0,            // 开始触摸X坐标
      startY: 0,            // 开始触摸Y坐标
      disX: 0,              // 滑动距离X
      disY: 0,              // 滑动距离Y
      startFromLeft: false,      // 是否是左滑返回
      allowLeftSlide: 0,// 是否允许左滑返回，主要拦截上下滑动
      enterDone: null,      // 进入完成done
      leaveDone: null,      // 退出完成done
      forward: true,         // 这次的路由变化是前进还是后退
      manual: false,        // 这次的路由变化是不是手动
      rect: {},
      hadCallGoBack: false,
      enterDom: null,
      leaveDom: null,
      stack: 0,
    }
  },
  mounted () {
    const self = this;
    this.$router.go = function go (n) {
      if (self.stack > 0) {
        if (n == -1 || n == '-1') {
          self.forward = false;
        }
        self.stack -= 2
        this.history.go(n);
      }
    };
    this.$router.beforeEach((to, from, next) => {
      this.stack += 1
      next()
    })
    this.rect = this.$refs.vueRuterSlide.getBoundingClientRect()
  },
  methods: {
    touchStart (ev) {
      ev = ev || event
      // 如果是从边缘开始滑动，判定为左滑返回
      if (ev.touches.length === 1 && ev.touches[0].clientX > this.rect.left && ev.touches[0].clientX < (this.rect.left+20)) {
        this.startX = ev.touches[0].clientX
        this.startY = ev.touches[0].clientY
        ev.preventDefault()
        ev.stopPropagation()
        this.startFromLeft = true
      } else {
        this.startFromLeft = false
      }
    },
    touchMove (ev) {
      ev = ev || event
      // 开始判断
      if (this.startFromLeft) {

        // 计算此刻滑动距离
        this.disX = this.startX - ev.touches[0].clientX
        this.disY = this.startY - ev.touches[0].clientY
        console.log(Math.abs(this.disX) , Math.abs(this.disY))
        // 如果当前是未判断是否左滑返回的，则时刻判断横向距离和纵向距离
        if (this.allowLeftSlide === 0) {
          if (Math.abs(this.disX) > Math.abs(this.disY)) {
            this.allowLeftSlide = 1
          } else {
            this.allowLeftSlide = -1
          }
        }

        if (this.allowLeftSlide === 1) {
          // 阻止默认事件
          ev.preventDefault()
          ev.stopPropagation()

          // 标志这次返回是手动
          this.manual = true

          // 执行返回操作
          if (!this.hadCallGoBack) {
            this.hadCallGoBack = true
            this.$router.go('-1')
          }

          this.leaveDom = this.$refs.vueRuterSlide.children[0]
          this.enterDom = this.$refs.vueRuterSlide.children[1]

          this.leaveDom.style.transform = `translate3d(${Math.abs(this.disX)}px, 0px, 0px)`
          this.leaveDom.style.zIndex = '99'
          this.enterDom.style.transform = `translate3d(${(Math.abs(this.disX)-320)/2}px, 0px, 0px)`
          this.enterDom.style.transform = '-1'

        }

      }
    },
    touchEnd (e) {
      console.log(e)
      if (this.allowLeftSlide) {
        this.hadCallGoBack = false

        this.leaveDom.classList.add('backward-before-manual-leave')
        this.enterDom.classList.add('backward-before-manual-leave')
        setTimeout(() => {
          this.leaveDom.setAttribute('style','')
          this.enterDom.setAttribute('style','')
          this.leaveDom.classList.add('backward-leave2')
          this.enterDom.classList.add('backward-enter2')
        }, 20)
        setTimeout(() => {
          this.leaveDone()
          this.enterDone()
          this.leaveDom.classList.remove('backward-leave2')
          this.enterDom.classList.remove('backward-enter2')
        }, 250)

        // 恢复
        this.startX = 0
        this.startY = 0
        this.disX = 0
        this.disY = 0
        this.startFromLeft = false
        this.allowLeftSlide = 0

        this.forward = true
        this.manual = false

        this.hadCallGoBack = false


      }
    },
    beforeEnter (el) {
      console.log('进入之前')
      if (!this.manual) {
        if (this.forward) {
          el.classList.add('forward-before-enter')
        } else {
          el.classList.add('backward-before-enter')
        }
      }
    },
    enter (el, done) {
      console.log('进入')
      this.enterDone = done;
      if (!this.manual) {
        setTimeout(() => {
          if (this.forward) {
            el.classList.add('forward-enter')
          } else {
            el.classList.add('backward-enter')
          }
        }, 20)
        setTimeout(() => {
          done()
        },500)
      }
    },
    afterEnter (el) {
      console.log('进入之后')
      if (!this.manual) {
        this.forward = true;
        el.classList.remove('forward-before-enter', 'backward-before-enter','forward-enter', 'backward-enter')
      }
    },
    beforeLeave (el) {
      console.log('进入之前')
      if (!this.manual) {
        if (this.forward) {
          el.classList.add('forward-before-leave')
        } else {
          el.classList.add('backward-before-leave')
        }
      } else {
        el.classList.add('backward-before-leave2')
      }
    },
    leave (el, done) {
      console.log('离开')
      this.leaveDone = done;
      if (!this.manual) {
        if (this.forward) {
          el.classList.add('forward-leave')
        } else {
          el.classList.add('backward-leave')
        }
        setTimeout(() => {
          done()
        }, 500)
      } else {
        setTimeout(() => {
          done()
        }, 50000000)
      }
    },
    afterLeave (el) {
      console.log('离开之后')
      if (!this.manual) {
        this.forward = true;
        el.classList.remove('forward-before-leave', 'backward-before-leave','forward-leave', 'backward-leave')
      }
    },
  }
}
</script>
<style scoped>
.vue-router-slide {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}




.forward-before-enter2,
.forward-before-leave2,
.backward-before-enter2,
.backward-before-leave2,
.backward-leave2,
.backward-enter2{
  position: absolute;
  top: 0;
  left: 0;
}

.backward-leave2 {
  transform: translate3d(100%, 0px, 0px) !important;
}
.backward-enter2{
  transform: translate3d(0px, 0px, 0px) !important;
}


.forward-before-enter,
.forward-before-leave,
.backward-before-enter,
.backward-before-leave,
.backward-leave,
.backward-enter{
  position: absolute;
  top: 0;
  left: 0;
  transition: all .5s;
}


.backward-before-manual-enter,
.backward-before-manual-leave{
  position: absolute;
  top: 0;
  left: 0;
  transition: all .25s;
}


.forward-before-enter {
  z-index: 2;
  transform: translate3d(100%, 0px, 0px);
}
.forward-before-leave{
  z-index: 1;
  transform: translate3d(0px, 0px, 0px);
}
.forward-enter {
  z-index: 2;
  transform: translate3d(0px, 0px, 0px);
}
.forward-leave{
  z-index: 1;
  transform: translate3d(-50%, 0px, 0px);
}
.backward-before-enter {
  z-index: -1;
  transform: translate3d(-50%, 0px, 0px);
}
.backward-before-leave {
  z-index: 99;
  transform: translate3d(0px, 0px, 0px);
}
.backward-enter {
  z-index: -1;
  transform: translate3d(0px, 0px, 0px);
}
.backward-leave {
  z-index: 99;
  transform: translate3d(100%, 0px, 0px);
}
</style>
