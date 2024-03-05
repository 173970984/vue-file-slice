/**
 * 路由配置
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';

Vue.use(VueRouter);
// 静态路由
const routes = [
  {
    path: '/',
    component: () => import('@/views/video/list'),
    meta: {title: '上传'}
  },

];

const router = new VueRouter({
  routes,
  mode: 'history'
});

// 路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start();

  next();

});

router.afterEach(() => {
  setTimeout(() => {
    NProgress.done(true);
  }, 300);
});

export default router;

/**
 * 更新浏览器标题
 * @param route 路由
 */
function updateTitle(route) {
  if (!route.path.startsWith('/redirect/')) {
    let names = [];
    if (route && route.meta && route.meta.title) {
      names.push(route.meta.title);
    }
    const appName = process.env.VUE_APP_NAME;
    if (appName) {
      names.push(appName);
    }
    document.title = names.join(' - ');
  }
}
