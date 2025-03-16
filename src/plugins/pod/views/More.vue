<script setup>
import { SyncOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  message: {
    type: String,
    required: false,
    default: '加载中…',
  },
});
const emits = defineEmits(['click']);

const handleClick = ({ key }) => {
  emits('click', key);
};
</script>

<template>
  <a-dropdown :disabled="disabled">
    <a-tooltip>
      <template #title>{{ message || '加载中…' }}</template>
      <a-button size="large" :disabled="disabled">
        <template #icon>
          <SyncOutlined />
        </template>
      </a-button>
    </a-tooltip>
    <template #overlay>
      <a-menu @click="handleClick">
        <a-menu-item key="1">加载10次</a-menu-item>
        <a-menu-item key="5">加载50次</a-menu-item>
        <a-menu-item key="10">加载100次</a-menu-item>
        <a-menu-item key="-1">加载全部</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped></style>
