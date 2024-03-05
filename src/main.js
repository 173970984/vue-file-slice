/** 主入口js */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './config/axios-config';
import './styles/index.scss';
import EleAdmin from 'ele-admin';
import DialogDirective from 'ele-admin/packages/dialog-directive';
import VueClipboard from 'vue-clipboard2';
import i18n from './lang';
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false;
Vue.use(EleAdmin, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(DialogDirective);
Vue.use(VueClipboard);

// 拉加载配置
Vue.use(VueLazyload, {
  preLoad: 1.3,

  attempt: 1,
  listenEvents: ['scroll']
})

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');
