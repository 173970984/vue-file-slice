<!-- 顶栏消息图标 -->
<template>
  <div></div>
</template>

<script>
export default {
  name: 'EleNotice',
  data() {
    return {
      visible: false,
      active: 'notice',
      notice: [
      ],
      message: [
      ],
      todo: [

      ]
    };
  },
  computed: {
    // 通知标题
    noticeLabel() {
      return this.notice.length ? `通知(${this.notice.length})` : '通知';
    },
    // 私信标题
    messageLabel() {
      return this.message.length ? `私信(${this.message.length})` : '私信';
    },
    // 待办标题
    todoLabel() {
      return this.todo.length ? `待办(${this.todo.length})` : '待办';
    },
    // 所有消息数量
    allNum() {
      return this.notice.length + this.message.length + this.todo.length;
    }
  },
  methods: {
    /* 清空消息 */
    clear(type) {
      if (type === 'notice') {
        this.notice = [];
      } else if (type === 'message') {
        this.message = [];
      } else if (type === 'todo') {
        this.todo = [];
      }
    },
    /* 查看更多 */
    more(type) {
      this.visible = false;
      if (this.$route.path !== '/user/message' || this.$route.query.type !== type) {
        this.$router.push({
          path: '/user/message',
          query: {
            type: type
          }
        });
      }
    }
  }
}
</script>

<style lang="scss">
.ele-notice-group {
  display: block;

  .el-badge {
    line-height: 1;
    display: block;
  }
}

/* 消息通知pop */
.ele-notice-pop {
  padding: 0 !important;

  /* tab */
  .el-tabs__nav-scroll {
    text-align: center;
  }

  .el-tabs__nav {
    float: none;
    display: inline-block;
  }

  .el-tabs__item {
    height: 44px;
    line-height: 44px;
    padding: 0 20px !important;
  }

  /* 空视图 */
  .ele-empty {
    padding: 100px 0;
  }
}

/* 列表 */
.ele-notice-list {
  padding-top: 8px;
  max-height: 360px;
  overflow: auto;
}

.ele-notice-item {
  .ele-notice-item-wrapper {
    padding: 12px 15px;
    transition: background-color .2s;
    cursor: pointer;

    &:hover {
      background-color: hsla(0, 0%, 60%, .05);
    }
  }

  .ele-text-secondary {
    margin-top: 5px;
    font-size: 13px;
  }

  .ele-cell-desc {
    margin-top: 3px !important;
    font-size: 12px !important;
  }
}

.ele-notice-item-icon {
  width: 32px;
  height: 32px;
  line-height: 32px !important;
  color: #FFF;
  font-size: 16px;
  background-color: #60B2FC;
  border-radius: 50%;
  text-align: center;


  &.el-icon-s-check {
    background-color: #F5686F;
  }

  &.el-icon-video-camera {
    background-color: #7CD734;
  }

  &.el-icon-s-claim {
    background-color: #FAAD14;
  }

  &.el-icon-message-solid {
    background-color: #2BCACD;
  }
}

/* 操作按钮 */
.ele-notice-actions > .ele-cell-content {
  line-height: 42px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: hsla(0, 0%, 60%, .05);
  }
}
</style>
