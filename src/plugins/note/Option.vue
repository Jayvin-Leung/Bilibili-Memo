<script setup>
import { ref } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import plugin from './plugin';
import config, { controller } from './config';
import { click } from './main';

defineProps({
  container: {
    type: Object,
    required: true,
    default: document.body,
  },
});

const state = ref({
  download: false,
});
const LOADING_TIME = 2000;

const handleClick = () => {
  state.value.download = true;
  click();
  setTimeout(() => {
    state.value.download = false;
  }, LOADING_TIME);
};
const handleChange = () => {
  controller.useChangeHandler();
};
</script>

<template>
  <a-row justify="space-between" class="custom-row">
    <a-col :span="18" style="color: #a9a9a9">{{ plugin.description }}</a-col>
    <a-col>
      <a-button :loading="state.download" @click="handleClick">立即执行</a-button>
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">
      合集视频只下载当前视频的笔记
      <a-tooltip
        :getPopupContainer="() => container"
        title="合集的视频数量影响笔记下载速度"
      >
        <ExclamationCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
      </a-tooltip>
    </a-col>
    <a-col class="custom-col-content">
      <a-switch v-model:checked="config.option.isOnlyCurr" @change="handleChange" />
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">目录清单风格</a-col>
    <a-col class="custom-col-content">
      <a-select
        :getPopupContainer="() => container"
        v-model:value="config.option.catalog.style"
        @change="handleChange"
        style="width: 160px"
      >
        <a-select-option value="callout_tasklist">callout + 任务列表</a-select-option>
        <a-select-option value="callout_orderedlist">callout + 有序列表</a-select-option>
        <a-select-option value="callout_bulletedlist">callout + 无序列表</a-select-option>
        <a-select-option value="callout">callout</a-select-option>
        <a-select-option value="quotes_tasklist">引用块 + 任务列表</a-select-option>
        <a-select-option value="quotes_orderedlist">引用块 + 有序列表</a-select-option>
        <a-select-option value="quotes_bulletedlist">引用块 + 无序列表</a-select-option>
        <a-select-option value="quotes">引用块</a-select-option>
        <a-select-option value="horizontalrule_tasklist">水平线 + 任务列表</a-select-option>
        <a-select-option value="horizontalrule_orderedlist">水平线 + 有序列表</a-select-option>
        <a-select-option value="horizontalrule_bulletedlist">水平线 + 无序列表</a-select-option>
        <a-select-option value="horizontalrule">水平线</a-select-option>
      </a-select>
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">目录清单分P标题格式</a-col>
    <a-col class="custom-col-content">
      <a-input
        v-model:value="config.option.title.pattern"
        @change="handleChange"
        style="width: 160px"
      >
        <template #suffix>
          <a-tooltip :getPopupContainer="() => container">
            <template #title>
              <p>{x}：表示分p数</p>
              <p>{xxx}：表示分p标题</p>
              <a-divider dashed style="border-color: gray" />
              <p>示例：第 {x} 集 《{xxx}》</p>
              <p>输出：第 1 集 《导学》</p>
            </template>
            <ExclamationCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
          </a-tooltip>
        </template>
      </a-input>
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">
      使用B站视频笔记格式
      <a-tooltip
        :getPopupContainer="() => container"
        title="该模式生成的笔记包含大量HTML标签"
      >
        <ExclamationCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
      </a-tooltip>
    </a-col>
    <a-col class="custom-col-content">
      <a-switch v-model:checked="config.option.note.isExtended" @change="handleChange" />
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">笔记语法风格</a-col>
    <a-col class="custom-col-content">
      <a-select
        :getPopupContainer="() => container"
        :disabled="config.option.note.isExtended"
        v-model:value="config.option.note.mode"
        @change="handleChange"
        style="width: 110px"
      >
        <a-select-option value="markdown">markdown</a-select-option>
        <a-select-option value="obsidian">obsidian</a-select-option>
      </a-select>
    </a-col>
  </a-row>

  <a-divider dashed style="border-color: gray">markdown/obsidian 语法设置</a-divider>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">笔记加粗方式</a-col>
    <a-col class="custom-col-content">
      <a-select
        :getPopupContainer="() => container"
        :disabled="config.option.note.isExtended"
        v-model:value="config.option.note.syntax.bold"
        @change="handleChange"
        style="width: 130px"
      >
        <a-select-option value="**">双星号包裹</a-select-option>
        <a-select-option value="__">双下划线包裹</a-select-option>
      </a-select>
    </a-col>
  </a-row>

  <a-row justify="space-between" class="custom-row">
    <a-col class="custom-col-label">笔记无序列表方式</a-col>
    <a-col class="custom-col-content">
      <a-select
        :getPopupContainer="() => container"
        :disabled="config.option.note.isExtended"
        v-model:value="config.option.note.syntax.list"
        @change="handleChange"
        style="width: 90px"
      >
        <a-select-option value="-">单减号</a-select-option>
        <a-select-option value="+">单加号</a-select-option>
        <a-select-option value="*">单星号</a-select-option>
      </a-select>
    </a-col>
  </a-row>
</template>

<style scoped></style>
