<script setup>
import { ref, onMounted } from 'vue';
import plugins from '@/plugins';
import OptionGeneral from './OptionGeneral.vue';
import OptionSyncAndBackup from './OptionSyncAndBackup.vue';

const settings = [
  {
    id: 'general',
    self: { name: '通用' },
    Option: OptionGeneral,
  },
  {
    id: 'syncAndBackup',
    self: { name: '同步&备份' },
    Option: OptionSyncAndBackup,
  },
];
const anchorItems = settings.concat(plugins).map((item) => {
  return {
    key: item.id,
    href: '#' + item.id,
    title: item.self.name,
  };
});

const contentItems = settings.concat(plugins).map((item) => {
  return {
    id: item.id,
    name: item.self.name,
    option: item.Option,
  };
});
const activeKey = ref(settings[0].id);
const container = ref();

const handleClickAnchor = (e, link) => {
  e.preventDefault();
  activeKey.value = link.href.substring(1);
};

onMounted(() => {
  container.value = document.querySelector('.custom-layout-conten');
});
</script>

<template>
  <a-layout class="custom-layout">
    <a-layout-sider theme="light" width="auto" class="custom-layout-sider">
      <a-anchor
        :getContainer="() => container"
        :items="anchorItems"
        :affix="false"
        @click="handleClickAnchor"
      />
    </a-layout-sider>

    <a-divider type="vertical" style="height: auto" />

    <a-layout-content width="auto" class="custom-layout-conten">
      <a-collapse v-model:activeKey="activeKey" ghost accordion class="custom-collapse">
        <a-collapse-panel v-for="item in contentItems" :key="item.id">
          <template #header>
            <a-divider
              :id="item.id"
              orientation="left"
              orientationMargin="0px"
              class="custom-divider"
            >
              {{ item.name }}
            </a-divider>
          </template>
          <component :is="item.option" :container="container" />
        </a-collapse-panel>
      </a-collapse>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.custom-layout {
  background-color: #fff;
  color: #000;
  max-height: 600px;
  overflow: hidden;
}
.custom-layout-sider {
  text-align: right;
  margin: 10px;
  height: 580px;
  overflow: auto;
}
.custom-layout-sider::-webkit-scrollbar {
  width: 0px;
}
.custom-layout-sider::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 5px;
}
.custom-layout-sider::-webkit-scrollbar-track {
  background-color: gainsboro;
}
.custom-layout-conten {
  text-align: left;
  margin: 10px;
  height: 580px;
  overflow: auto;
}
.custom-layout-conten::-webkit-scrollbar {
  width: 0px;
  height: 0px;
  position: absolute;
  left: 0;
}
.custom-layout-conten::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 5px;
}
.custom-layout-conten::-webkit-scrollbar-track {
  background-color: transparent;
}
.custom-divider {
  font-weight: bold;
  font-size: 18px;
  margin: 0;
}
.custom-collapse:deep(.ant-collapse-header) {
  padding: 0;
  background-color: aliceblue;
}
.custom-collapse:deep(.ant-collapse-content-box) {
  padding: 0;
}
</style>
