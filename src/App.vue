<script setup>
import { SettingOutlined } from '@ant-design/icons-vue';
import { templateModal } from '@/components/modal';
import storageUtil from '@/utils/storageUtil';
import Toolbar from './views/toolbar/Toolbar.vue';
import Agreement from './Agreement.vue';

const showModal = () => {
  templateModal({ title: '使用须知', template: Agreement });
};
</script>

<template>
  <Toolbar v-if="storageUtil.getAgreement()" style="z-index: 9999" />
  <a-float-button
    v-else
    style="z-index: 9999; left: 24px; bottom: 24px"
    @click="showModal"
  >
    <template #icon>
      <SettingOutlined />
    </template>
  </a-float-button>
</template>

<style scoped></style>
