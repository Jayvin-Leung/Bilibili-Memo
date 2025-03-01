<script setup>
import { ref } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import dateUtil from '@/utils/dateUtil';
import config, { controller } from '../config';
import { validate, backup, autoBackup, restore } from '../main';
import { setTimer } from '../job';

defineProps({
  container: {
    type: Object,
    required: true,
    default: document.body,
  },
});

const state = ref({
  token: '',
  webhook: '',
  vaild: false,
  backup: false,
  restore: false,
});

const handleChangeToken = (e) => {
  if (e.target.value) state.value.token = '';
};
const handleChangeWebhook = (e) => {
  if (e.target.value) state.value.webhook = '';
};
const handleValidate = () => {
  const token = config.syncAndBackup.wps.airScript.token;
  const webhook = config.syncAndBackup.wps.airScript.webhook;
  if (!token || !webhook) {
    if (!token) state.value.token = 'error';
    if (!webhook) state.value.webhook = 'error';
    return;
  }

  state.value.vaild = true;
  validate(
    () => {
      state.value.vaild = false;
    },
    () => {
      state.value.vaild = false;
    }
  );
};
const handleBackup = () => {
  state.value.backup = true;
  backup(
    () => {
      state.value.backup = false;
    },
    () => {
      state.value.backup = false;
    }
  );
};
const handleRestore = () => {
  state.value.restore = true;
  restore(
    () => {
      state.value.restore = false;
    },
    () => {
      state.value.restore = false;
    }
  );
};
const handleChangeAutoBackupInterval = () => {
  controller.useChangeHandler();
  setTimer(config.syncAndBackup.wps.backup.autoBackupInterval, autoBackup);
};
</script>

<template>
  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">脚本令牌</a-col>
    <a-col class="custom-col-content">
      <a-input
        allow-clear
        :status="state.token"
        v-model:value="config.syncAndBackup.wps.airScript.token"
        @change="handleChangeToken"
        style="width: 220px"
      />
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">脚本webhook</a-col>
    <a-col class="custom-col-content">
      <a-input
        allow-clear
        :status="state.webhook"
        v-model:value="config.syncAndBackup.wps.airScript.webhook"
        @change="handleChangeWebhook"
        style="width: 300px"
      />
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label"></a-col>
    <a-col class="custom-col-content">
      <a-button type="primary" :loading="state.vaild" @click="handleValidate">
        验证
      </a-button>
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">
      间隔
      <a-select
        :getPopupContainer="() => container"
        :disabled="!config.syncAndBackup.wps.airScript.isValid"
        v-model:value="config.syncAndBackup.wps.backup.autoBackupInterval"
        @change="handleChangeAutoBackupInterval"
      >
        <a-select-option :value="0">0</a-select-option>
        <a-select-option :value="5">5</a-select-option>
        <a-select-option :value="10">10</a-select-option>
        <a-select-option :value="15">15</a-select-option>
        <a-select-option :value="30">30</a-select-option>
        <a-select-option :value="60">60</a-select-option>
      </a-select>
      分钟自动备份
      <a-tooltip
        :getPopupContainer="() => container"
        title="间隔0分钟表示不开启自动备份"
      >
        <ExclamationCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
      </a-tooltip>
    </a-col>

    <a-col class="custom-col-content">
      <a-button
        :disabled="!config.syncAndBackup.wps.airScript.isValid"
        :loading="state.backup"
        @click="handleBackup"
        style="margin-right: 5px"
      >
        备份至云端
      </a-button>
      <a-popconfirm
        :getPopupContainer="() => container"
        :disabled="!config.syncAndBackup.wps.airScript.isValid"
        title="该操作会覆盖掉当前全部数据，确定吗?"
        ok-text="确定"
        cancel-text="取消"
        @confirm="handleRestore"
        :overlayInnerStyle="{ width: '300px' }"
      >
        <a-button
          :disabled="!config.syncAndBackup.wps.airScript.isValid"
          :loading="state.restore"
          danger
          style="margin-left: 5px"
        >
          从云端恢复
        </a-button>
      </a-popconfirm>
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label backup-time">
      上一次备份时间：
      {{
        config.syncAndBackup.wps.backup.lastBackupTime
          ? dateUtil.timestampToDate[1](config.syncAndBackup.wps.backup.lastBackupTime)
          : '无备份历史'
      }}
    </a-col>
    <a-col class="custom-col-content restore-time">
      上一次恢复时间：
      {{
        config.syncAndBackup.wps.backup.lastRestoreTime
          ? dateUtil.timestampToDate[1](config.syncAndBackup.wps.backup.lastRestoreTime)
          : '无恢复历史'
      }}
    </a-col>
  </a-row>
</template>

<style scoped>
.backup-time,
.restore-time {
  font-size: 12px;
  color: #bbbbbb;
}
</style>
