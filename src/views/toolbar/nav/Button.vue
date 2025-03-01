<script setup>
import { BarsOutlined } from '@ant-design/icons-vue';
import menu from '@/views/toolbar/menu';
import config from './config';

const handleTrigger = () => {
  const baseConfig = menu.config.getValue();
  const max = baseConfig.general.shortcutMaxShow;
  const mode = baseConfig.general.shortcutShowMode;
  return config.pluginVOs.length > max ? mode : '';
};
const handleType = (item) => {
  if (item.type === 'immediate') return 'default';
  return item.isActive ? 'primary' : 'default';
};
</script>

<template>
  <a-float-button-group :trigger="handleTrigger()">
    <template #icon>
      <BarsOutlined />
    </template>
    <a-float-button
      v-for="item in config.pluginVOs"
      :key="item.id"
      :tooltip="item.name"
      :type="handleType(item)"
      @click="item.$click"
    >
      <template #icon>
        <component :is="item.icon" />
      </template>
    </a-float-button>
  </a-float-button-group>
</template>

<style scoped></style>
