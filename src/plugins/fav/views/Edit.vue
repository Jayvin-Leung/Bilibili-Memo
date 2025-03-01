<script setup>
import { ref, toRaw } from 'vue';
import { messageModal } from '@/components/modal';
import DynamicTag from '@/components/tag/DynamicTag.vue';
import { view as viewApi } from '@/service/bilibili/api/video';

const props = defineProps([
  'bvid',
  'pic',
  'title',
  'desc',
  'remark',
  'tags',
  'ctime',
  'mtime',
]);
const emits = defineEmits(['change']);

const formState = ref({ ...props });
viewApi(
  props.bvid,
  (result) => {
    if (result) {
      formState.value.pic = result.pic;
      formState.value.title = result.title;
      formState.value.desc = result.desc;
    }
  },
  (message) => {
    messageModal({ title: '提示', message, type: 'warning' });
  }
);

const handleChange = () => {
  emits('change', toRaw(formState.value));
};
const handleTagsChange = (tags) => {
  formState.value.tags = tags;
  handleChange();
};
</script>

<template>
  <a-form :model="formState" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
    <a-form-item label="备注">
      <a-textarea
        v-model:value="formState.remark"
        show-count
        :maxlength="500"
        :auto-size="{ minRows: 4, maxRows: 10 }"
        @change="handleChange"
      />
    </a-form-item>
    <a-form-item label="标签">
      <DynamicTag :tags="formState.tags || ''" @change="handleTagsChange" />
    </a-form-item>
  </a-form>
</template>

<style scoped></style>
