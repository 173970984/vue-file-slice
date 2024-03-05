<!-- 顶栏右侧区域按钮 -->
<template>
  <div class="ele-admin-header-tool">

  </div>
</template>

<script>
import {isFullscreen, toggleFullscreen} from 'ele-admin/packages/util';

export default {
  name: 'EleHeaderRight',
  emits: ['item-click', 'change-language'],
  props: {
    // 是否显示打开设置抽屉按钮
    showSetting: {
      type: Boolean,
      default: true
    },
    cureCompany:{}
  },
  computed: {
    // 当前登录用户信息
    loginUser() {
      return this.$store.state.user.user;
    },
    // 当前语言
    language() {
      return this.$i18n.locale;
    }
  },
  data() {
    return {
      // 是否全屏状态
      fullscreen: false,
    };
  },
  mounted(){

  },
  methods: {
    /* 个人信息下拉菜单点击 */
    onUserDropClick(command) {
      if (command === 'logout') {
        // 退出登录
        this.$confirm(
          this.$t('layout.logout.message'),
          this.$t('layout.logout.title'),
          {type: 'warning'}
        ).then(() => {
          // 调用接口退出登录
          this.$http.get('/logout').then(res => {
            if (res.data.code === 0) {
              // 清除缓存的token
              this.$store.dispatch('user/removeToken').then(() => {
                location.replace('/login');  // 这样跳转避免再次登录重复注册动态路由
              });
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch((e) => {
            this.$message.error(e.message);
          });

        }).catch(() => {
        });
      } else if (command === 'profile') {
        if (this.$route.fullPath !== '/user/profile') {
          this.$router.push('/user/profile');
        }
      } else if (command === 'password') {
        this.$emit('item-click', 'password');
      }
    },
    /* 打开设置抽屉 */
    openSetting() {
      this.$emit('item-click', 'setting');
    },
    /* 全屏切换 */
    changeFullscreen() {
      try {
        this.fullscreen = toggleFullscreen();
      } catch (e) {
        this.$message.error('您的浏览器不支持全屏模式');
      }
    },
    /* 检查全屏状态 */
    checkFullscreen() {
      this.fullscreen = isFullscreen();
    },
    /* 切换语言 */
    changeLanguage(lang) {
      this.$emit('change-language', lang);
    },
    changeCompany(row){
      let user =  this.$store.state.user.user
      user.cureCompany = row
      localStorage.setItem("cureCompany",JSON.stringify(row))
      this.$store.dispatch('user/setUser', user);
      this.$forceUpdate()
      window.location.reload();
    }
  }
}
</script>
