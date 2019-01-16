import Vue from 'vue'
import Router from 'vue-router'
import FrontPage from '../views/FrontPage.vue'
import ItemPage from '../views/ItemPage'
import Meta from "vue-meta"; // https://github.com/declandewet/vue-meta

Vue.use(Router);
Vue.use(Meta);

export default new Router({
  // mode: 'history',
  // fallback: false,
  // scrollBehavior: () => ({ y: 0 }),
  routes: [
    {path: '/:id', name: 'ItemPage', component: ItemPage},
    {path: '/', name: 'FrontPage', component: FrontPage},
    {path: '*', redirect: '/'}
  ]
})
