import Vue from "vue";
import Router from "vue-router";
import Meta from "vue-meta"; // https://github.com/declandewet/vue-meta

Vue.use(Router);
Vue.use(Meta, { keyName: "metaInfo" });

const FrontPage = () => import("../views/FrontPage.vue");
const ItemPage = () => import("../views/ItemPage.vue");
const StaticPage = () => import("../views/StaticPage.vue");

const router = new Router({
  mode: "history",
  // fallback: false,
  // scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: "/:id", name: "ItemPage", component: ItemPage },
    { path: "/", name: "FrontPage", component: FrontPage },
    { path: "/page/:id", component: StaticPage },
    { path: "*", redirect: "/" }
  ]
});

router.afterEach((to, from) => {
  if (window._paq) {
    window._paq.push(["setCustomUrl", to.fullPath]);
    window._paq.push(["trackPageView"]);
  }
});

export default router;
