<script setup>
import { SettingOutlined } from '@ant-design/icons-vue';
import { templateModal } from '@/components/modal';
import Option from './template/Option.vue';

const showModal = () => {
  templateModal({ title: '设置', template: Option });
};
</script>

<template>
  <a-float-button v-bind="$attrs" @click="showModal">
    <template #icon>
      <SettingOutlined />
    </template>
  </a-float-button>
</template>

<style scoped></style>
