<!-- 框架布局 -->
<template>
 <div></div>
</template>

<script>
import {mapGetters} from 'vuex';
import EleHeaderRight from './header-right';
import ElePassword from './password';
import EleFooter from './footer';
import setting from '@/config/setting';
import {
  reloadPageTab,
  addPageTab,
  removePageTab,
  removeAllPageTab,
  removeLeftPageTab,
  removeRightPageTab,
  removeOtherPageTab
} from '@/utils/page-tab-util';

export default {
  name: 'EleLayout',
  components: {
    EleHeaderRight,
    ElePassword,
    EleFooter
  },
  computed: {
    // 主页标题, 移除国际化上面template中使用:home-title="setting.homeTitle"
    homeTitle() {
      return this.$t('layout.home');
    },
    ...mapGetters(['theme', 'user'])
  },
  data() {
    return {
      // 全局配置
      setting: setting,
      // 是否显示修改密码弹窗
      showPassword: false,
      // 是否显示主题设置抽屉
      showSetting: false,
      // 是否显示主体部分
      showContent: true,
      // 项目名
      projectName: process.env.VUE_APP_NAME,
      cureCompany:null
    };
  },
  created() {
    // 获取用户信息
    this.getUserInfo();
  },
  methods: {
    /* 获取当前用户信息 */
    getUserInfo() {
      if (setting.userUrl) {
        this.$http.get(setting.userUrl).then((res) => {
          const result = setting.parseUser ? setting.parseUser(res.data) : res.data;
          if (result.code === 0) {
            let  user = result.data;
            let cureCompany =  localStorage.getItem("cureCompany")
            if(!cureCompany){
              localStorage.setItem("cureCompany",JSON.stringify(user["userCompanyList"][0]))
            }
            if(!this.$store.state.user.user.cureCompany){
              console.log(" cureCompanycureCompanycureCompany ")
              user.cureCompany =  user["userCompanyList"][0]
              localStorage.setItem("cureCompany",JSON.stringify(user["userCompanyList"][0]))
              this.cureCompany =user["userCompanyList"][0]
            }else{
              this.cureCompany =this.$store.state.user.user.cureCompany
            }
            this.$store.dispatch('user/setUser', user);
            this.$store.dispatch('user/setRoles', user ? user.roles : null);
            this.$store.dispatch('user/setAuthorities', user ? user.authorities : null);
            // 设置节点权限
            this.$store.dispatch('user/setPermission', user ? user.permissionList : null);
          } else if (result.msg) {
            this.$message.error(result.msg);
          }
          // 在用户权限信息请求完成后再渲染主体部分, 以免权限控制指令不生效
          this.showContent = true;
          this.$forceUpdate()
        }).catch((e) => {
          console.error(e);
          this.showContent = true;
          this.$message.error(e.message);
        });
      }
    },
    /* 顶栏右侧点击 */
    onItemClick(key) {
      if (key === 'password') {
        this.showPassword = true;
      } else if (key === 'setting') {
        this.showSetting = true;
      }
    },
    /* 刷新页签 */
    reloadPage() {
      reloadPageTab();
    },
    /* logo点击事件 */
    onLogoClick(isHome) {
      if (!isHome) {
        this.$router.push('/');
      }
    },
    /* 更新collapse */
    updateCollapse(value) {
      this.$store.dispatch('theme/set', {key: 'collapse', value: value});
    },
    /* 更新屏幕尺寸 */
    updateScreen() {
      this.$store.dispatch('theme/updateScreen');
      const checkFullscreen = this.$refs.header.checkFullscreen;
      checkFullscreen && checkFullscreen();
    },
    /* 切换主题风格 */
    changeStyle(value) {
      this.$store.dispatch('theme/set', value);
    },
    /* 切换主题色 */
    changeColor(value) {
      const loading = this.$loading({lock: true, background: 'transparent'});
      this.$store.dispatch('theme/setColor', value).then(() => {
        loading.close();
      }).catch((e) => {
        console.error(e);
        loading.close();
        this.$message.error('主题加载失败');
      });
    },
    changeDarkMode(value) {
      this.$store.dispatch('theme/setDarkMode', value);
    },
    changeWeakMode(value) {
      this.$store.dispatch('theme/setWeakMode', value);
    },
    setHomeComponents(components) {
      this.$store.dispatch('theme/setHomeComponents', components);
    },
    /* 添加tab */
    tabAdd(value) {
      addPageTab(value);
    },
    /* 移除tab */
    tabRemove(obj) {
      removePageTab(obj.name).then(({lastPath}) => {
        if (obj.active === obj.name) {
          this.$router.push(lastPath || '/');
        }
      });
    },
    /* 移除全部tab */
    tabRemoveAll(active) {
      removeAllPageTab();
      if (active !== '/') {
        this.$router.push('/');
      }
    },
    /* 移除左边tab */
    tabRemoveLeft(value) {
      removeLeftPageTab(value);
    },
    /* 移除右边tab */
    tabRemoveRight(value) {
      removeRightPageTab(value);
    },
    /* 移除其它tab */
    tabRemoveOther(value) {
      removeOtherPageTab(value);
    },
    /* 菜单路由国际化对应的名称 */
    i18n(path, key/*, menu*/) {
      // 参数三menu即原始菜单数据, 如果需要菜单标题多语言数据从接口返回可用此参数获取对应的多语言标题
      // 例如下面这样写, 接口的菜单数据为{path: '/system/user', titles: {zh: '用户管理', en: 'User'}}
      // return menu ? menu.titles[this.$i18n.locale] : null;
      const k = 'route.' + key + '._name', title = this.$t(k);
      return title === k ? null : title;
    },
    /* 切换语言 */
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      this.$refs.layout.changeLanguage();
      localStorage.setItem('i18n-lang', lang);
    }
  }
}
</script>
