<script setup>
import { ref } from 'vue';
import storageUtil from '@/utils/storageUtil';

const projectName = __PROJECT_NAME__;
const state = ref({
  agree: false,
});

const handleAgree = () => {
  state.value.agree = true;
  setTimeout(() => {
    storageUtil.setAgreement(true);
  }, 100);
};
</script>

<template>
  <a-typography>
    <a-typography-title :level="5">
      欢迎使用本插件！请务必知悉以下事项：
    </a-typography-title>
    <a-typography-paragraph>
      <ul>
        <li>
          本插件完全免费开源，代码公开透明（https://github.com/Jayvin-Leung/{{projectName}}）
        </li>
        <li>本插件不涉及修改您的B站用户数据（以下称“B站数据”）</li>
        <li>使用本插件时产生的数据（以下称“插件数据”）都会保存在浏览器本地</li>
        <li>本插件不会收集您的B站数据和插件数据</li>
        <li>
          受技术和能力所限，本插件可能存在未测试到的bug，可能会导致部分插件数据异常，请定期导出到本地或备份到云端
        </li>
      </ul>
    </a-typography-paragraph>
    <a-typography-title :level="5">您需知悉：</a-typography-title>
    <a-typography-paragraph>
      <ul>
        <li>开发者无法为您因插件数据丢失或异常所导致的损失负责</li>
        <li>使用即表示您愿意接受插件数据可能丢失或异常的风险</li>
      </ul>
    </a-typography-paragraph>
  </a-typography>

  <a-row style="justify-content: center">
    <a-button type="primary" :loading="state.agree" @click="handleAgree">确定</a-button>
  </a-row>
</template>

<style scoped>
ul li {
  padding: 4px 0;
  line-height: 24px;
  list-style: disc;
}
</style>
