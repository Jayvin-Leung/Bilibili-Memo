<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import DraggableList from '@/components/draggable/DraggableList.vue';
import plugins from '@/plugins';
import nav from '@/views/toolbar/nav';
import config, { controller } from '../config';

defineProps({
  container: {
    type: Object,
    required: true,
    default: document.body,
  },
});

const handleChangeSort = (newShortcuts) => {
  config.general.shortcuts = newShortcuts;
  handleChangeShow();
};
const handleChangeShow = () => {
  nav.self.$reset();
  handleChange();
};
const handleChange = () => {
  controller.useChangeHandler();
};
</script>

<template>
  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">
      快捷方式栏最大显示数量
      <a-tooltip
        :getPopupContainer="() => container"
        title="大于该数量将收起为一个按钮"
      >
        <ExclamationCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
      </a-tooltip>
    </a-col>
    <a-col class="custom-col-content">
      <a-select
        :getPopupContainer="() => container"
        v-model:value="config.general.shortcutMaxShow"
        @change="handleChange"
        style="width: 60px"
      >
        <a-select-option :value="0">0</a-select-option>
        <a-select-option :value="1">1</a-select-option>
        <a-select-option :value="2">2</a-select-option>
        <a-select-option :value="3">3</a-select-option>
      </a-select>
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">快捷方式栏展开方式</a-col>
    <a-col class="custom-col-content">
      <a-select
        :getPopupContainer="() => container"
        v-model:value="config.general.shortcutShowMode"
        @change="handleChange"
        style="width: 70px"
      >
        <a-select-option value="hover">触碰</a-select-option>
        <a-select-option value="click">点击</a-select-option>
      </a-select>
    </a-col>
  </a-row>

  <a-divider dashed style="border-color: gray">
    拖住排序（快捷方式的显示/隐藏不影响功能的开启/关闭）
  </a-divider>

  <a-row justify="space-between" class="custom-row">
    <DraggableList :list="config.general.shortcuts" @change="handleChangeSort">
      <template #item="{ id, name, index }">
        <a-row justify="space-between" class="custom-row">
          <a-col class="custom-col-label">
            <component :is="plugins.find((item) => item.id === id)?.self.icon" />
            {{ name }}
          </a-col>
          <a-col class="custom-col-content">
            <a-switch
              v-model:checked="config.general.shortcuts[index].isShow"
              @change="handleChangeShow"
            />
          </a-col>
        </a-row>
      </template>
    </DraggableList>
  </a-row>
</template>

<style scoped></style>
