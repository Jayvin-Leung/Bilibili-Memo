<script setup>
import { ref, nextTick } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  tags: {
    type: String,
    required: true,
    default: '',
  },
  color: {
    type: String,
    default: 'red',
  },
});
const emits = defineEmits(['change']);

const inputRef = ref();
const state = ref({
  tags: props.tags ? props.tags.split(',') : [],
  inputVisible: false,
  inputValue: '',
});

const handleClose = (removedTag) => {
  const tags = state.value.tags.filter((tag) => tag !== removedTag);
  state.value.tags = tags;
  emits('change', state.value.tags.join());
};
const showInput = () => {
  state.value.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};
const handleInputConfirm = () => {
  const inputValue = state.value.inputValue;
  let tags = state.value.tags;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  Object.assign(state.value, {
    tags,
    inputVisible: false,
    inputValue: '',
  });
  emits('change', state.value.tags.join());
};
</script>

<template>
  <template v-for="tag in state.tags" :key="tag">
    <a-tooltip v-if="tag.length > 20" :title="tag">
      <a-tag :color="color" closable @close="handleClose(tag)">
        {{ `${tag.slice(0, 20)}...` }}
      </a-tag>
    </a-tooltip>
    <a-tag v-else :color="color" closable @close="handleClose(tag)">
      {{ tag }}
    </a-tag>
  </template>
  <a-input
    v-if="state.inputVisible"
    ref="inputRef"
    v-model:value="state.inputValue"
    type="text"
    size="small"
    @blur="handleInputConfirm"
    @keyup.enter="handleInputConfirm"
    style="width: 78px"
  />
  <a-tag v-else @click="showInput" style="background: #fff; border-style: dashed">
    <PlusOutlined />
    New Tag
  </a-tag>
</template>

<style scoped></style>
