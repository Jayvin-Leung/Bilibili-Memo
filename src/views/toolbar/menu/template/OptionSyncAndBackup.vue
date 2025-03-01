<script setup>
import { ref } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import config, { controller } from '../config';
import { download, upload } from '../main';
import OptionWPS from './OptionWPS.vue';

defineProps({
  container: {
    type: Object,
    required: true,
    default: document.body,
  },
});

const state = ref({
  exp: false,
  imp: false,
});
const LOADING_TIME = 2000;
const visible = ref(false);

const handleExport = () => {
  state.value.exp = true;
  download(() => {
    setTimeout(() => {
      state.value.exp = false;
    }, LOADING_TIME);
  });
};
const handleImport = () => {
  state.value.imp = true;
  upload(() => {
    setTimeout(() => {
      state.value.imp = false;
    }, LOADING_TIME);
  });
};

const handleChangeActive = (checked, event) => {
  if (checked) {
    event.preventDefault();
    visible.value = true;
    return;
  }
  config.syncAndBackup.wps.isActive = false;
  controller.useChangeHandler();
};
const handleConfirm = () => {
  visible.value = false;
  config.syncAndBackup.wps.isActive = true;
  controller.useChangeHandler();
};
const handleCancel = () => {
  visible.value = false;
};
</script>

<template>
  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">下载插件数据到本地</a-col>
    <a-col class="custom-col-content">
      <a-button :loading="state.exp" @click="handleExport">导出</a-button>
      <a-popconfirm
        :getPopupContainer="() => container"
        title="该操作会覆盖掉当前全部数据，确定吗?"
        ok-text="确定"
        cancel-text="取消"
        @confirm="handleImport"
        :overlayInnerStyle="{ width: '300px' }"
      >
        <a-button danger :loading="state.imp" style="margin-left: 10px">导入</a-button>
      </a-popconfirm>
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">
      备份插件数据到WPS
      <a-tooltip
        :getPopupContainer="() => container"
        title="该功能依赖网络连接及第三方软件（金山文档WPS）接口的稳定性"
      >
        <ExclamationCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
      </a-tooltip>
    </a-col>
    <a-col class="custom-col-content">
      <a-popconfirm
        :getPopupContainer="() => container"
        :open="visible"
        title="该功能将会使插件数据传输至第三方软件（金山文档WPS），传输只会在本插件及您指定的WPS账号的指定文档之间进行，确定开启吗?"
        ok-text="确定"
        cancel-text="取消"
        @confirm="handleConfirm"
        @cancel="handleCancel"
        :overlayInnerStyle="{ width: '300px' }"
      >
        <a-switch
          :checked="config.syncAndBackup.wps.isActive"
          @change="handleChangeActive"
        />
      </a-popconfirm>
    </a-col>
  </a-row>

  <OptionWPS v-if="config.syncAndBackup.wps.isActive" :container="container" />
</template>

<style scoped></style>
