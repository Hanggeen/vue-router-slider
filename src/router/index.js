import Vue from 'vue'
import Router from 'vue-router'
import Page0 from '@/pages/page0'
import Page1 from '@/pages/page1'
import Page2 from '@/pages/page2'
import Page3 from '@/pages/page3'
import Page4 from '@/pages/page4'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Page0',
      component: Page0
    },
    {
      path: '/page1',
      name: 'Page1',
      component: Page1
    },
    {
      path: '/page2',
      name: 'Page2',
      component: Page2
    },
    {
      path: '/page3',
      name: 'Page3',
      component: Page3
    },
    {
      path: '/page4',
      name: 'Page4',
      component: Page4
    },
  ]
})
