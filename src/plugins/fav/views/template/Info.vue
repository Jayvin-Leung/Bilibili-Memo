<script setup>
import { ref, toRaw, onMounted } from 'vue';
import DynamicTag from '@/components/tag/DynamicTag.vue';

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
const emits = defineEmits(['change', 'close']);

const container = ref();
const textareaRef = ref();
const formState = ref({ ...props });

const handleTagsChange = (tags) => {
  formState.value.tags = tags;
};
const handleSubmit = () => {
  if (!formState.value.ctime) {
    formState.value.ctime = Date.now();
  }
  formState.value.mtime = Date.now();
  emits('change', toRaw(formState.value));
  emits('close');
};

onMounted(() => {
  container.value = document.querySelector('.custom-form');
  textareaRef.value.focus();
});
</script>

<template>
  <a-form
    :model="formState"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 17 }"
    class="custom-form"
  >
    <a-form-item label="视频封面">
      <a-image
        v-if="formState.pic"
        :src="formState.pic"
        :preview="{
          getContainer: () => container,
        }"
        :width="200"
      />
      <span v-else>无</span>
    </a-form-item>

    <a-form-item label="视频标题">
      <a-input
        v-model:value="formState.title"
        :bordered="false"
        disabled
        style="color: gray"
      />
    </a-form-item>

    <a-form-item label="视频简介">
      <a-textarea
        v-model:value="formState.desc"
        :bordered="false"
        autoSize
        disabled
        style="color: gray"
      />
    </a-form-item>

    <a-form-item label="备注">
      <a-textarea
        ref="textareaRef"
        v-model:value="formState.remark"
        show-count
        :maxlength="500"
        :auto-size="{ minRows: 4 }"
      />
    </a-form-item>

    <a-form-item label="标签">
      <DynamicTag :tags="formState.tags || ''" @change="handleTagsChange" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 4, offset: 11 }">
      <a-button type="primary" @click="handleSubmit">保存</a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped></style>
