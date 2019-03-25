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
      startX: 0,                      // 开始触摸X坐标
      startY: 0,                      // 开始触摸Y坐标
      disX: 0,                        // 滑动距离X
      disY: 0,                        // 滑动距离Y
      touchStartFromAbleArea: false,  // 触摸是否是从有效区域开始
      isSlideToRightSlide: 0,         // 是否允许右滑返回，主要拦截上下滑动，0为未判断，1为往右滑，-1为非往右
      enterDone: null,                // 进入完成done
      leaveDone: null,                // 退出完成done
      forward: true,                  // 这次的路由变化是前进还是后退
      manual: false,                  // 这次的路由变化是不是手动
      rect: {},                       // 当前屏幕的信息
      hadCallGoBack: false,           // 是否已经调用了路由返回操作
      enterDom: null,                 // 即将进入的dom
      leaveDom: null,                 // 即将离开的dom
      stack: 0,                       // 当前页面栈
      ableRange: 0.4,                 // 屏幕左边滑动的有效区域百分比
      cancelGoBack: false,            // 是否中途取消返回
    }
  },
  mounted () {
    const self = this;

    // 拦截go(-1)，如果当前页面栈为0，不给于后退
    this.$router.go = function go (n) {
      console.log('路由拦截')
      if (n == -1 || n == '-1') {
        if (self.stack > 0) {
          self.forward = false
        } else {
          return
        }
      }
      this.history.go(n)
    };

    // 路由守卫计算stack
    this.$router.beforeEach((to, from, next) => {
      console.log('路由守卫')
      if (this.forward) {
        this.stack += 1
      } else {
        this.stack -= 1
      }
      next()
    })

    // 获取当前容器宽度，暂不监听屏幕改变
    this.rect = this.$refs.vueRuterSlide.getBoundingClientRect()
  },
  methods: {
    touchStart (ev) {
      ev = ev || event
      // 如果是从边缘开始滑动，判定为右滑返回
      if (ev.touches.length === 1 &&
          ev.touches[0].clientX > this.rect.left &&
          ev.touches[0].clientX < (this.rect.left+this.rect.width*this.ableRange) &&
          this.stack > 0) {
        this.startX = ev.touches[0].clientX
        this.startY = ev.touches[0].clientY
        this.touchStartFromAbleArea = true
      } else {
        this.touchStartFromAbleArea = false
      }
    },
    touchMove (ev) {
      ev = ev || event
      // 开始判断
      if (this.touchStartFromAbleArea) {

        // 计算此刻滑动距离
        this.disX = this.startX - ev.touches[0].clientX
        this.disY = this.startY - ev.touches[0].clientY
        // 如果当前是未判断是否右滑返回的，则时刻判断横向距离和纵向距离
        if (this.isSlideToRightSlide === 0) {
          if (Math.abs(this.disX) > Math.abs(this.disY)) {
            this.isSlideToRightSlide = 1
          } else {
            this.isSlideToRightSlide = -1
          }
        }

        if (this.isSlideToRightSlide === 1) {
          // 阻止默认事件
          ev.preventDefault()
          ev.stopPropagation()

          // 标志这次返回是手动
          this.manual = true

          // 执行返回操作
          if (!this.hadCallGoBack) {
            this.hadCallGoBack = true
            this.$router.go('-1')
          } else {
            // 这里部分不应该重复操作，待优化
            if (this.leaveDom !== null && this.leaveDom !== undefined) {
              this.leaveDom.classList.add('high-z-index')
              this.leaveDom.style.transform = `translate3d(${Math.abs(this.disX)}px, 0px, 0px)`
            } else {
              this.leaveDom = this.$refs.vueRuterSlide.children[0]
            }
            if (this.enterDom !== null && this.enterDom !== undefined) {
              this.enterDom.classList.add('low-z-index')
              this.enterDom.style.transform = `translate3d(${(Math.abs(this.disX)-320)/2}px, 0px, 0px)`
            } else {
              this.enterDom = this.$refs.vueRuterSlide.children[1]
            }
          }

        }

      }
    },
    touchEnd (e) {
      if (this.isSlideToRightSlide == 1) {

        // 左滑是否大于一半
        if (Math.abs(this.disX) > this.rect.width/2) {

          this.leaveDom.classList.add('transition-all-250', 'high-z-index')
          this.enterDom.classList.add('transition-all-250', 'low-z-index')

          setTimeout(() => {
            this.leaveDom.setAttribute('style','')
            this.enterDom.setAttribute('style','')
            this.leaveDom.classList.add('transform100')
            this.enterDom.classList.add('transform0')
          }, 20)
          setTimeout(() => {
            this.leaveDone()
            this.enterDone()
            this.leaveDom.classList.remove('position-absolute', 'transition-all-250','high-z-index', 'low-z-index', 'transform0', 'transform-50', 'transform100')
            this.enterDom.classList.remove('position-absolute', 'transition-all-250','high-z-index', 'low-z-index', 'transform0', 'transform-50', 'transform100')
            this.enterDom = null
            this.leaveDom = null
          }, 250)

          // 恢复
          this.startX = 0
          this.startY = 0
          this.disX = 0
          this.disY = 0
          this.touchStartFromAbleArea = false

          this.forward = true
          this.manual = false

          this.hadCallGoBack = false
          this.isSlideToRightSlide = 0
        } else {
          this.cancelGoBack = true;
          this.manual = true;
          this.$router.go(1)
          this.stack += 2


          this.hadCallGoBack = false

          this.leaveDom = this.$refs.vueRuterSlide.children[0]
          this.enterDom = this.$refs.vueRuterSlide.children[1]
          this.leaveDom.classList.add('ori-leave')
          this.enterDom.classList.add('ori-enter')
          this.leaveDom.classList.add('transition-all-250', 'high-z-index')
          this.enterDom.classList.add('transition-all-250', 'low-z-index')


          setTimeout(() => {
              this.leaveDom = this.$refs.vueRuterSlide.children[0]
              this.enterDom = this.$refs.vueRuterSlide.children[1]
              this.enterDom.style.transform = `translate3d(${Math.abs(this.disX)}px, 0px, 0px)`
              this.leaveDom.style.transform = `translate3d(${(Math.abs(this.disX)-320)/2}px, 0px, 0px)`
              this.enterDom.classList.add('transition-all-250', 'high-z-index')
              this.leaveDom.classList.add('transition-all-250', 'low-z-index')
              this.$nextTick(() => {
                this.enterDom.style.transform = `translate3d(0px, 0px, 0px)`
                this.leaveDom.style.transform = `translate3d(-50%, 0px, 0px)`
              })
          }, 20)

          setTimeout(() => {
            // alert(this.enterDom.classList)
            this.leaveDone()
            this.enterDone()
            this.leaveDom.classList.remove('position-absolute', 'transition-all-250','high-z-index', 'low-z-index', 'transform0', 'transform-50', 'transform100')
            this.enterDom.classList.remove('position-absolute', 'transition-all-250','high-z-index', 'low-z-index', 'transform0', 'transform-50', 'transform100')
            this.enterDom.style = ``
            this.enterDom.style = ``
            this.disX = 0
            this.disY = 0
            // 恢复
            this.startX = 0
            this.startY = 0
            this.touchStartFromAbleArea = false

            this.forward = true
            this.manual = false

            this.hadCallGoBack = false
            this.isSlideToRightSlide = 0
            this.enterDom = null
            this.leaveDom = null
          }, 270)
        }
      }
      this.isSlideToRightSlide = 0
    },
    beforeEnter (el) {
      console.log('进入之前')

      // 如果不是手动的
      if (!this.manual) {
        // 如果是前进
        if (this.forward) {
          el.classList.add('position-absolute', 'transform100', 'high-z-index')
        } else {
          el.classList.add('position-absolute', 'transform-50', 'low-z-index')
        }
      } else {
        el.classList.add('position-absolute')
        el.style.transform = `translate3d(${Math.abs(this.disX)}px, 0px, 0px)`
      }
    },
    beforeLeave (el) {
      console.log('离开之前')

      // 如果不是手动的
      if (!this.manual) {
        if (this.forward) {
          el.classList.add('position-absolute', 'transform0', 'low-z-index')
        } else {
          el.classList.add('position-absolute', 'transform0', 'high-z-index')
        }
      } else {
        el.classList.add('position-absolute')
      }
    },
    enter (el, done) {
      console.log('进入')
      // 将完成钩子赋值给实例
      this.enterDone = done;

      if (!this.manual) {
        setTimeout(() => {
          el.classList.add('transition-all-500')
          el.classList.remove('transform0', 'transform-50', 'transform100')
          el.classList.add('transform0')
        }, 20)
        setTimeout(() => {
          done()
        },500)
      }
    },
    leave (el, done) {
      console.log('离开')

      // 将完成钩子赋值给实例
      this.leaveDone = done;
      if (!this.manual) {
        if (this.forward) {
          el.classList.add('transition-all-500')
          el.classList.remove('transform0', 'transform-50', 'transform100')
          el.classList.add('transform-50')
        } else {
          el.classList.add('transition-all-500')
          el.classList.remove('transform0', 'transform-50', 'transform100')
          el.classList.add('transform100')
        }
        setTimeout(() => {
          done()
        }, 500)
      }
    },
    afterEnter (el) {
      console.log('进入之后')
      if (!this.manual) {
        this.forward = true;
        el.classList.remove('position-absolute', 'transition-all-500','high-z-index', 'low-z-index', 'transform0', 'transform-50', 'transform100')
      }
    },
    afterLeave (el) {
      console.log('离开之后')
      if (!this.manual) {
        this.forward = true;
        el.classList.remove('position-absolute', 'transition-all-500','high-z-index', 'low-z-index', 'transform0', 'transform-50', 'transform100')
      }
    },
  }
}
</script>
<style scoped>
.vue-router-slide {
  position: relative;
  overflow-x: hidden;
}


.position-absolute{
  position: absolute;
  top: 0;
  left: 0;
}

.transition-all-500 {
  transition: transform .5s;
  -moz-transition: transform .5s; /* Firefox 4 */
  -webkit-transition: transform .5s; /* Safari 和 Chrome */
  -o-transition: transform .5s; /* Opera */
}

.transition-all-250 {
  transition: transform .25s;
  -moz-transition: transform .25s; /* Firefox 4 */
  -webkit-transition: transform .25s; /* Safari 和 Chrome */
  -o-transition: transform .25s; /* Opera */
}

.high-z-index {
  z-index: 99;
}

.low-z-index {
  z-index: -1;
}

.transform0 {
  transform:translate3d(0, 0px, 0px);
  -ms-transform:translate3d(0, 0px, 0px);   /* IE 9 */
  -moz-transform:translate3d(0, 0px, 0px);  /* Firefox */
  -webkit-transform:translate3d(0, 0px, 0px); /* Safari 和 Chrome */
  -o-transform:translate3d(0, 0px, 0px);    /* Opera */
}
.transform-50 {
  transform:translate3d(-50%, 0px, 0px);;
  -ms-transform:translate3d(-50%, 0px, 0px);;   /* IE 9 */
  -moz-transform:translate3d(-50%, 0px, 0px);;  /* Firefox */
  -webkit-transform:translate3d(-50%, 0px, 0px);; /* Safari 和 Chrome */
  -o-transform:translate3d(-50%, 0px, 0px);;
}
.transform100 {
  transform:translate3d(100%, 0px, 0px);
  -ms-transform:translate3d(100%, 0px, 0px);   /* IE 9 */
  -moz-transform:translate3d(100%, 0px, 0px);  /* Firefox */
  -webkit-transform:translate3d(100%, 0px, 0px); /* Safari 和 Chrome */
  -o-transform:translate3d(100%, 0px, 0px);
}
</style>
