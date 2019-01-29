import Vue from 'vue'
import Router from 'vue-router'
import Meta from "vue-meta"; // https://github.com/declandewet/vue-meta

Vue.use(Router);
Vue.use(Meta);

const FrontPage = () => import('../views/FrontPage.vue')
const ItemPage = () => import('../views/ItemPage.vue')

export default new Router({
  mode: 'history',
  // fallback: false,
  // scrollBehavior: () => ({ y: 0 }),
  routes: [
    {path: '/:id', name: 'ItemPage', component: ItemPage},
    {path: '/', name: 'FrontPage', component: FrontPage},
    {path: '*', redirect: '/'}
  ]
})
